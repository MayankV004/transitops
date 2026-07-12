import type { Vehicle, Driver } from "@/generated/prisma/client";

export function checkCapacity(vehicle: Pick<Vehicle, "maxLoadKg">, cargoWeight: number) {
  if (cargoWeight > vehicle.maxLoadKg) {
    return {
      valid: false,
      error: `Capacity exceeded by ${cargoWeight - vehicle.maxLoadKg} kg — dispatch blocked.`,
    };
  }
  return { valid: true };
}

export function canDispatch(vehicle: Vehicle, driver: Driver, cargoWeight: number) {
  if (vehicle.status !== "AVAILABLE") {
    return { valid: false, error: "Vehicle is not available." };
  }

  if (driver.status !== "AVAILABLE") {
    return { valid: false, error: "Driver is not available." };
  }

  const isLicenseExpired = new Date(driver.licenseExpiry).getTime() < Date.now();
  if (isLicenseExpired) {
    return { valid: false, error: "Driver's license is expired." };
  }

  return checkCapacity(vehicle, cargoWeight);
}

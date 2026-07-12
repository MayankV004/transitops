import { VehicleStatus, DriverStatus, TripStatus } from '../src/generated/prisma/client';
import prisma from '../src/lib/prisma';

async function main() {
  console.log('Starting seeding...');

  // 1. Clear existing data (optional but good for testing)
  // Deleting in order of relations to prevent foreign key constraint failures
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  // 2. Create Vehicles
  const v1 = await prisma.vehicle.create({
    data: {
      regNumber: 'TR-1001',
      name: 'Volvo FH16',
      type: 'Truck',
      maxLoadKg: 15000,
      odometer: 120500,
      acquisitionCost: 120000,
      status: VehicleStatus.AVAILABLE,
    }
  });

  const v2 = await prisma.vehicle.create({
    data: {
      regNumber: 'VN-2001',
      name: 'Mercedes Sprinter',
      type: 'Van',
      maxLoadKg: 3500,
      odometer: 45200,
      acquisitionCost: 45000,
      status: VehicleStatus.ON_TRIP,
    }
  });
  
  const v3 = await prisma.vehicle.create({
    data: {
      regNumber: 'TR-1002',
      name: 'Scania R500',
      type: 'Truck',
      maxLoadKg: 18000,
      odometer: 89000,
      acquisitionCost: 135000,
      status: VehicleStatus.IN_SHOP,
    }
  });

  // 3. Create Drivers
  const d1 = await prisma.driver.create({
    data: {
      name: 'John Doe',
      licenseNumber: 'DL-554433',
      licenseCategory: 'Heavy',
      licenseExpiry: new Date('2028-12-31'),
      contact: '+1-555-0101',
      safetyScore: 98,
      status: DriverStatus.AVAILABLE,
    }
  });

  const d2 = await prisma.driver.create({
    data: {
      name: 'Jane Smith',
      licenseNumber: 'DL-998877',
      licenseCategory: 'Light',
      licenseExpiry: new Date('2027-06-15'),
      contact: '+1-555-0202',
      safetyScore: 95,
      status: DriverStatus.ON_TRIP,
    }
  });

  // 4. Create Trips
  const t1 = await prisma.trip.create({
    data: {
      source: 'Warehouse A (NY)',
      destination: 'Distribution Center (BOS)',
      vehicleId: v2.id,
      driverId: d2.id,
      cargoWeight: 2000,
      plannedDistance: 350,
      status: TripStatus.DISPATCHED,
    }
  });

  const t2 = await prisma.trip.create({
    data: {
      source: 'Port Authority',
      destination: 'Warehouse B (NJ)',
      vehicleId: v1.id,
      driverId: d1.id,
      cargoWeight: 14000,
      plannedDistance: 120,
      actualDistance: 125,
      fuelConsumed: 45,
      status: TripStatus.COMPLETED,
      completedAt: new Date(),
    }
  });

  // 5. Create Expenses & Fuel Logs
  await prisma.expense.create({
    data: {
      vehicleId: v2.id,
      tripId: t1.id,
      type: 'Toll',
      amount: 15.50,
    }
  });

  await prisma.fuelLog.create({
    data: {
      vehicleId: v1.id,
      liters: 150,
      cost: 450,
    }
  });

  // 6. Create Maintenance Log
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v3.id,
      description: 'Engine diagnostic and oil change',
      cost: 1200,
      isActive: true,
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

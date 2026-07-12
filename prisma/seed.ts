import { VehicleStatus, DriverStatus, TripStatus } from '../src/generated/prisma/client';
import prisma from '../src/lib/prisma';
import { subDays, subMonths, addDays } from 'date-fns';

async function main() {
  console.log('Starting massive seeding...');

  // 1. Clear existing data
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  // 2. Create Vehicles (10 vehicles)
  const v1 = await prisma.vehicle.create({ data: { regNumber: 'TR-1001', name: 'Volvo FH16', type: 'Truck', maxLoadKg: 15000, odometer: 120500, acquisitionCost: 120000, status: VehicleStatus.AVAILABLE } });
  const v2 = await prisma.vehicle.create({ data: { regNumber: 'VN-2001', name: 'Mercedes Sprinter', type: 'Van', maxLoadKg: 3500, odometer: 45200, acquisitionCost: 45000, status: VehicleStatus.ON_TRIP } });
  const v3 = await prisma.vehicle.create({ data: { regNumber: 'TR-1002', name: 'Scania R500', type: 'Truck', maxLoadKg: 18000, odometer: 89000, acquisitionCost: 135000, status: VehicleStatus.IN_SHOP } });
  const v4 = await prisma.vehicle.create({ data: { regNumber: 'TR-1003', name: 'MAN TGX', type: 'Truck', maxLoadKg: 20000, odometer: 67000, acquisitionCost: 140000, status: VehicleStatus.AVAILABLE } });
  const v5 = await prisma.vehicle.create({ data: { regNumber: 'VN-2002', name: 'Ford Transit', type: 'Van', maxLoadKg: 3000, odometer: 32000, acquisitionCost: 38000, status: VehicleStatus.AVAILABLE } });
  const v6 = await prisma.vehicle.create({ data: { regNumber: 'TR-1004', name: 'DAF XF', type: 'Truck', maxLoadKg: 16000, odometer: 150000, acquisitionCost: 110000, status: VehicleStatus.RETIRED } });
  const v7 = await prisma.vehicle.create({ data: { regNumber: 'VN-2003', name: 'VW Crafter', type: 'Van', maxLoadKg: 4000, odometer: 15000, acquisitionCost: 48000, status: VehicleStatus.ON_TRIP } });
  const v8 = await prisma.vehicle.create({ data: { regNumber: 'TR-1005', name: 'Iveco S-Way', type: 'Truck', maxLoadKg: 19000, odometer: 22000, acquisitionCost: 145000, status: VehicleStatus.AVAILABLE } });
  const v9 = await prisma.vehicle.create({ data: { regNumber: 'VN-2004', name: 'Renault Master', type: 'Van', maxLoadKg: 3200, odometer: 88000, acquisitionCost: 35000, status: VehicleStatus.IN_SHOP } });
  const v10 = await prisma.vehicle.create({ data: { regNumber: 'TR-1006', name: 'Volvo FH', type: 'Truck', maxLoadKg: 15000, odometer: 43000, acquisitionCost: 125000, status: VehicleStatus.AVAILABLE } });

  const vehicles = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10];

  // 3. Create Drivers (8 drivers)
  const d1 = await prisma.driver.create({ data: { name: 'John Doe', licenseNumber: 'DL-554433', licenseCategory: 'Heavy', licenseExpiry: addDays(new Date(), 900), contact: '+1-555-0101', safetyScore: 98, status: DriverStatus.AVAILABLE } });
  const d2 = await prisma.driver.create({ data: { name: 'Jane Smith', licenseNumber: 'DL-998877', licenseCategory: 'Light', licenseExpiry: addDays(new Date(), 400), contact: '+1-555-0202', safetyScore: 95, status: DriverStatus.ON_TRIP } });
  const d3 = await prisma.driver.create({ data: { name: 'Mike Johnson', licenseNumber: 'DL-112233', licenseCategory: 'Heavy', licenseExpiry: addDays(new Date(), 120), contact: '+1-555-0303', safetyScore: 88, status: DriverStatus.AVAILABLE } });
  const d4 = await prisma.driver.create({ data: { name: 'Sarah Williams', licenseNumber: 'DL-445566', licenseCategory: 'Light', licenseExpiry: addDays(new Date(), 600), contact: '+1-555-0404', safetyScore: 100, status: DriverStatus.ON_TRIP } });
  const d5 = await prisma.driver.create({ data: { name: 'Robert Brown', licenseNumber: 'DL-778899', licenseCategory: 'Heavy', licenseExpiry: addDays(new Date(), 80), contact: '+1-555-0505', safetyScore: 72, status: DriverStatus.SUSPENDED } });
  const d6 = await prisma.driver.create({ data: { name: 'Emily Davis', licenseNumber: 'DL-334455', licenseCategory: 'Light', licenseExpiry: addDays(new Date(), 1000), contact: '+1-555-0606', safetyScore: 92, status: DriverStatus.AVAILABLE } });
  const d7 = await prisma.driver.create({ data: { name: 'David Miller', licenseNumber: 'DL-667788', licenseCategory: 'Heavy', licenseExpiry: subDays(new Date(), 5), contact: '+1-555-0707', safetyScore: 65, status: DriverStatus.SUSPENDED } });
  const d8 = await prisma.driver.create({ data: { name: 'Lisa Wilson', licenseNumber: 'DL-223344', licenseCategory: 'Heavy', licenseExpiry: addDays(new Date(), 500), contact: '+1-555-0808', safetyScore: 97, status: DriverStatus.AVAILABLE } });

  // 4. Create Current Trips (Matching the ON_TRIP status of vehicles/drivers)
  await prisma.trip.create({
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

  await prisma.trip.create({
    data: {
      source: 'Factory (OH)',
      destination: 'Retail Hub (PA)',
      vehicleId: v7.id,
      driverId: d4.id,
      cargoWeight: 3500,
      plannedDistance: 450,
      status: TripStatus.DISPATCHED,
    }
  });

  // 5. Create Historical Trips (To populate the charts and reports)
  const historicalTripsCount = 30;
  const cities = ['New York', 'Boston', 'Philadelphia', 'Washington DC', 'Chicago', 'Detroit', 'Atlanta', 'Miami'];
  
  for (let i = 0; i < historicalTripsCount; i++) {
    // Generate dates over the last 6 months
    const completedAt = subDays(new Date(), Math.floor(Math.random() * 180));
    const createdAt = subDays(completedAt, Math.floor(Math.random() * 3) + 1);
    
    // Pick random available vehicle and driver (just for historical record)
    const v = vehicles[Math.floor(Math.random() * vehicles.length)];
    const d = [d1, d3, d6, d8][Math.floor(Math.random() * 4)];
    
    const plannedDistance = Math.floor(Math.random() * 800) + 50;
    const actualDistance = plannedDistance + Math.floor(Math.random() * 40) - 10;
    
    const source = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    while(destination === source) destination = cities[Math.floor(Math.random() * cities.length)];

    const trip = await prisma.trip.create({
      data: {
        source,
        destination,
        vehicleId: v.id,
        driverId: d.id,
        cargoWeight: Math.floor(Math.random() * v.maxLoadKg * 0.9), // up to 90% capacity
        plannedDistance,
        actualDistance,
        fuelConsumed: actualDistance / (v.type === 'Truck' ? 3 : 8), // roughly 3km/L for trucks, 8 for vans
        status: TripStatus.COMPLETED,
        createdAt,
        completedAt,
      }
    });

    // Generate matching fuel logs and expenses for this historical trip
    if (Math.random() > 0.3) {
      await prisma.fuelLog.create({
        data: {
          vehicleId: v.id,
          liters: trip.fuelConsumed || 50,
          cost: (trip.fuelConsumed || 50) * 1.5, // $1.50 per liter
          date: createdAt,
        }
      });
    }

    if (Math.random() > 0.5) {
      await prisma.expense.create({
        data: {
          vehicleId: v.id,
          tripId: trip.id,
          type: Math.random() > 0.5 ? 'Toll' : 'Parking',
          amount: Math.floor(Math.random() * 40) + 5,
          date: createdAt,
        }
      });
    }
  }

  // 6. Create Current Maintenance Logs
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v3.id,
      description: 'Engine diagnostic and transmission rebuild',
      cost: 4500,
      isActive: true,
    }
  });

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v9.id,
      description: 'Brake pads replacement and AC fix',
      cost: 850,
      isActive: true,
    }
  });

  // Historical maintenance logs
  for (let i = 0; i < 8; i++) {
    const v = vehicles[Math.floor(Math.random() * vehicles.length)];
    await prisma.maintenanceLog.create({
      data: {
        vehicleId: v.id,
        description: ['Routine Oil Change', 'Tire Rotation & Alignment', 'Wiper replacement', 'Battery Swap'][Math.floor(Math.random() * 4)],
        cost: Math.floor(Math.random() * 500) + 50,
        isActive: false,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 100)),
      }
    });
  }

  console.log('Massive seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

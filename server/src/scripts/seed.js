const mongoose = require('mongoose');
const User = require('../models/User');
const Facility = require('../models/Facility');
const Appointment = require('../models/Appointment');
const Reminder = require('../models/Reminder');
const { addDays, addHours } = require('date-fns');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medireach';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Facility.deleteMany({});
    await Appointment.deleteMany({});
    await Reminder.deleteMany({});
    console.log('Cleared existing data');

    // Create facilities
    const facilities = await Facility.insertMany([
      {
        name: 'Muhimbili National Hospital',
        address: 'United Nations Road, Upanga West, Dar es Salaam',
        contactNumber: '+255222150302',
        services: ['General Consultation', 'Surgery', 'Pediatrics', 'Maternity', 'Emergency']
      },
      {
        name: 'Aga Khan Hospital',
        address: 'Ocean Road, Dar es Salaam',
        contactNumber: '+255222115151',
        services: ['General Consultation', 'Cardiology', 'Orthopedics', 'Dental']
      },
      {
        name: 'Mwananyamala Hospital',
        address: 'Mwananyamala, Dar es Salaam',
        contactNumber: '+255222862331',
        services: ['General Consultation', 'Surgery', 'Maternity', 'Pharmacy']
      },
      {
        name: 'Kilimanjaro Christian Medical Centre',
        address: 'Moshi, Kilimanjaro',
        contactNumber: '+255272754377',
        services: ['General Consultation', 'Surgery', 'Oncology', 'Radiology']
      }
    ]);
    console.log(`Created ${facilities.length} facilities`);

    // Create users
    const patients = await User.insertMany([
      {
        name: 'John Mwamba',
        phone: '+255712345678',
        role: 'patient',
        consentSms: true
      },
      {
        name: 'Sarah Kilonzo',
        phone: '+255787654321',
        role: 'patient',
        consentSms: true
      },
      {
        name: 'David Mtui',
        phone: '+255765432109',
        role: 'patient',
        consentSms: false
      }
    ]);
    console.log(`Created ${patients.length} patients`);

    const staff = await User.insertMany([
      {
        name: 'Dr. Grace Kimaro',
        phone: '+255713456789',
        role: 'staff',
        facilityId: facilities[0]._id
      },
      {
        name: 'Nurse Peter Ndege',
        phone: '+255754321098',
        role: 'staff',
        facilityId: facilities[1]._id
      }
    ]);
    console.log(`Created ${staff.length} staff members`);

    // Create appointments
    const tomorrow = addDays(new Date(), 1);
    const dayAfter = addDays(new Date(), 2);
    const nextWeek = addDays(new Date(), 7);

    const appointments = await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        facilityId: facilities[0]._id,
        service: 'General Consultation',
        scheduledAt: addHours(tomorrow, 10),
        status: 'confirmed',
        notes: 'Annual checkup'
      },
      {
        patientId: patients[1]._id,
        facilityId: facilities[1]._id,
        service: 'Cardiology',
        scheduledAt: addHours(dayAfter, 14),
        status: 'pending',
        notes: 'Follow-up appointment'
      },
      {
        patientId: patients[0]._id,
        facilityId: facilities[2]._id,
        service: 'Dental',
        scheduledAt: addHours(nextWeek, 9),
        status: 'confirmed',
        notes: 'Dental cleaning'
      }
    ]);
    console.log(`Created ${appointments.length} appointments`);

    console.log('\n=== Seed Data Summary ===');
    console.log(`Facilities: ${facilities.length}`);
    console.log(`Patients: ${patients.length}`);
    console.log(`Staff: ${staff.length}`);
    console.log(`Appointments: ${appointments.length}`);
    console.log('\n=== Sample Credentials ===');
    console.log('Patient Login:');
    console.log(`  Phone: ${patients[0].phone}`);
    console.log(`  Name: ${patients[0].name}`);
    console.log('\nStaff Login:');
    console.log(`  Phone: ${staff[0].phone}`);
    console.log(`  Name: ${staff[0].name}`);
    console.log(`  Facility: ${facilities[0].name}`);
    
    await mongoose.connection.close();
    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

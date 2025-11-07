/**
 * Migration Script: MongoDB Compass (Local) → MongoDB Atlas (Cloud)
 *
 * This script migrates all data from your local MongoDB to Atlas
 *
 * Usage:
 *   node src/scripts/migrateToAtlas.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

// Connection URIs
const LOCAL_URI = "mongodb://localhost:27017/medireach";
const ATLAS_URI = process.env.MONGO_URI; // From .env file

// Import models
const User = require("../models/User");
const Facility = require("../models/Facility");
const Appointment = require("../models/Appointment");
const Reminder = require("../models/Reminder");

async function migrateData() {
  console.log("🚀 Starting migration from Local MongoDB to Atlas...\n");

  try {
    // Step 1: Connect to LOCAL MongoDB
    console.log("📡 Connecting to LOCAL MongoDB (Compass)...");
    const localConn = await mongoose.createConnection(LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to LOCAL MongoDB\n");

    // Step 2: Fetch all data from local
    console.log("📥 Fetching data from local database...");

    const localUsers = await localConn.model("User", User.schema).find({});
    const localFacilities = await localConn
      .model("Facility", Facility.schema)
      .find({});
    const localAppointments = await localConn
      .model("Appointment", Appointment.schema)
      .find({});
    const localReminders = await localConn
      .model("Reminder", Reminder.schema)
      .find({});

    console.log(`   - Users: ${localUsers.length}`);
    console.log(`   - Facilities: ${localFacilities.length}`);
    console.log(`   - Appointments: ${localAppointments.length}`);
    console.log(`   - Reminders: ${localReminders.length}\n`);

    if (
      localUsers.length === 0 &&
      localFacilities.length === 0 &&
      localAppointments.length === 0 &&
      localReminders.length === 0
    ) {
      console.log("⚠️  No data found in local database. Nothing to migrate.");
      await localConn.close();
      process.exit(0);
    }

    // Step 3: Close local connection
    await localConn.close();
    console.log("✅ Local connection closed\n");

    // Step 4: Connect to ATLAS MongoDB
    console.log("📡 Connecting to MongoDB ATLAS...");

    if (!ATLAS_URI || ATLAS_URI.includes("<db_password>")) {
      throw new Error(
        "❌ Please update MONGO_URI in .env file with your actual Atlas password!"
      );
    }

    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB ATLAS\n");

    // Step 5: Insert data into Atlas
    console.log("📤 Migrating data to Atlas...");

    let migratedCount = 0;

    if (localUsers.length > 0) {
      await User.insertMany(localUsers, { ordered: false }).catch((err) => {
        if (err.code === 11000) {
          console.log("   ⚠️  Some users already exist (skipping duplicates)");
        } else {
          throw err;
        }
      });
      migratedCount += localUsers.length;
      console.log(`   ✅ Users migrated: ${localUsers.length}`);
    }

    if (localFacilities.length > 0) {
      await Facility.insertMany(localFacilities, { ordered: false }).catch(
        (err) => {
          if (err.code === 11000) {
            console.log(
              "   ⚠️  Some facilities already exist (skipping duplicates)"
            );
          } else {
            throw err;
          }
        }
      );
      migratedCount += localFacilities.length;
      console.log(`   ✅ Facilities migrated: ${localFacilities.length}`);
    }

    if (localAppointments.length > 0) {
      await Appointment.insertMany(localAppointments, { ordered: false }).catch(
        (err) => {
          if (err.code === 11000) {
            console.log(
              "   ⚠️  Some appointments already exist (skipping duplicates)"
            );
          } else {
            throw err;
          }
        }
      );
      migratedCount += localAppointments.length;
      console.log(`   ✅ Appointments migrated: ${localAppointments.length}`);
    }

    if (localReminders.length > 0) {
      await Reminder.insertMany(localReminders, { ordered: false }).catch(
        (err) => {
          if (err.code === 11000) {
            console.log(
              "   ⚠️  Some reminders already exist (skipping duplicates)"
            );
          } else {
            throw err;
          }
        }
      );
      migratedCount += localReminders.length;
      console.log(`   ✅ Reminders migrated: ${localReminders.length}`);
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`   Total documents migrated: ${migratedCount}\n`);

    // Step 6: Verify migration
    console.log("🔍 Verifying migration...");
    const atlasUserCount = await User.countDocuments();
    const atlasFacilityCount = await Facility.countDocuments();
    const atlasAppointmentCount = await Appointment.countDocuments();
    const atlasReminderCount = await Reminder.countDocuments();

    console.log(`   - Users in Atlas: ${atlasUserCount}`);
    console.log(`   - Facilities in Atlas: ${atlasFacilityCount}`);
    console.log(`   - Appointments in Atlas: ${atlasAppointmentCount}`);
    console.log(`   - Reminders in Atlas: ${atlasReminderCount}\n`);

    console.log("✅ All done! Your data is now on MongoDB Atlas.");
    console.log("💡 You can now start your server with: npm run dev\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run migration
migrateData();

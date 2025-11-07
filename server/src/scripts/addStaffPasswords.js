/**
 * Script to add passwords to existing staff users
 *
 * Usage: node src/scripts/addStaffPasswords.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI;

// Default password for staff (you can change these)
const STAFF_PASSWORDS = {
  "+255713456789": "staff123", // Dr. Grace Kimaro
  "+255754321098": "staff123", // Nurse Peter Ndege
};

async function addStaffPasswords() {
  try {
    console.log("🔐 Adding passwords to staff accounts...\n");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const staffUsers = await User.find({ role: { $in: ["staff", "admin"] } });
    console.log(`Found ${staffUsers.length} staff users\n`);

    for (const user of staffUsers) {
      const defaultPassword = STAFF_PASSWORDS[user.phone] || "staff123";

      user.password = defaultPassword;
      await user.save();

      console.log(`✅ ${user.name} (${user.phone})`);
      console.log(`   Password: ${defaultPassword}\n`);
    }

    console.log("🎉 All staff passwords updated!\n");
    console.log("📝 Staff Login Credentials:");
    console.log("─".repeat(50));

    for (const user of staffUsers) {
      const password = STAFF_PASSWORDS[user.phone] || "staff123";
      console.log(`\nName: ${user.name}`);
      console.log(`Phone: ${user.phone}`);
      console.log(`Password: ${password}`);
      console.log(`Facility: ${user.facilityId ? "Assigned" : "Not assigned"}`);
    }

    console.log("\n" + "─".repeat(50));
    console.log(
      "\n✨ You can now login to /staff/login with these credentials!"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

addStaffPasswords();

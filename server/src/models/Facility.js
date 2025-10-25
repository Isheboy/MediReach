const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  services: {
    type: [String],
    default: ['General Checkup', 'Vaccination', 'Maternity', 'Laboratory', 'Dental']
  }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
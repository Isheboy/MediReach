const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Appointment date/time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

appointmentSchema.index({ patientId: 1, scheduledAt: -1 });
appointmentSchema.index({ facilityId: 1, scheduledAt: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
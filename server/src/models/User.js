const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true, validate: { validator: function(v) {
        return /^\+255\d{9}$/.test(v);
    }, message: props => `${props.value} is not a valid Tanzanian phone number!` } },
    role: { type: String, enum: ['patient', 'staff', 'admin'], required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    consentSms: { type: Boolean, default: false },
},{ timestamps: true });

userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);
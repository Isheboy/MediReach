const Reminder = require('../models/Reminder');
const { subHours } = require('date-fns');

const scheduleReminders = async (appointmentId, patientPhone, scheduledAt) => {
  try {
    const reminders = [
      { offset: '48h', scheduledSendAt: subHours(scheduledAt, 48) },
      { offset: '24h', scheduledSendAt: subHours(scheduledAt, 24) },
      { offset: '2h', scheduledSendAt: subHours(scheduledAt, 2) }
    ];

    const created = [];
    for (const reminder of reminders) {
      const newReminder = new Reminder({
        appointmentId,
        patientPhone,
        scheduledSendAt: reminder.scheduledSendAt,
        offset: reminder.offset,
        status: 'scheduled'
      });
      await newReminder.save();
      created.push(newReminder);
    }

    return created;
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    throw error;
  }
};

module.exports = { scheduleReminders };
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roll: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
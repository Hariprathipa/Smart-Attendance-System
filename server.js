const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Attendance Schema
const attendanceSchema = new mongoose.Schema({
  name: String,
  roll: String,
  date: String,
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    default: "Pending"
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// ✅ API Route
app.post('/submit-attendance', async (req, res) => {
  try {
    const { name, roll, date, latitude, longitude } = req.body;

    // ✅ Time Check: only allow between 9:00 - 9:30 AM
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (hour === 9 && minute >= 0 && minute <= 30) {
      const newAttendance = new Attendance({
        name,
        roll,
        date,
        latitude,
        longitude,
        status: "Pending"
      });

      await newAttendance.save();
      res.status(200).json({ message: "✅ Attendance submitted and pending staff approval." });
    } else {
      res.status(403).json({ message: "❌ Attendance only allowed between 9:00 - 9:30 AM." });
    }
  } catch (err) {
    console.error("❌ Error saving attendance:", err);
    res.status(500).json({ message: "❌ Server error." });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
  
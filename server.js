const express = require("express");
const mongoose = require("mongoose"); // Use mongoose for MongoDB
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection setup
const mongoURI = "mongodb+srv://erokkumar876:yXkv0HFzVh4kQz1I@attendance.77tvb.mongodb.net/";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Convert current time to IST (UTC +5:30) and remove seconds and milliseconds
function getISTDateWithoutSeconds() {
  const date = new Date();
  
  // Convert the current time to IST (India Standard Time)
  const ISTDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  // Set seconds and milliseconds to 0
  ISTDate.setSeconds(0);
  ISTDate.setMilliseconds(0);

  return ISTDate;
}

// Define the schema for attendance
const attendanceSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
  date: { type: String, required: true }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// POST route for Login
app.post("/login", async (req, res) => {
  const { employeeName } = req.body;
  const date = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

  try {
    // Check if the employee already logged in today
    const existingRecord = await Attendance.findOne({ employeeName, date });

    if (existingRecord) {
      return res.status(400).json({ message: "User already logged in today." });
    }

    // Insert login record with IST time and no seconds/milliseconds
    const loginTime = getISTDateWithoutSeconds();  // Get the time in IST
    const newAttendance = new Attendance({ employeeName, date, loginTime });
    await newAttendance.save();

    res.status(200).json({ message: "Login successful.", recordId: newAttendance._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route for Logout
app.post("/logout", async (req, res) => {
  const { employeeName } = req.body;
  const date = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

  try {
    // Check if employee has logged in today
    const record = await Attendance.findOne({ employeeName, date });

    if (!record) {
      return res.status(400).json({ message: "User has not logged in today." });
    }

    if (record.logoutTime) {
      return res.status(400).json({ message: "User already logged out." });
    }

    // Update logout time with IST time and no seconds/milliseconds
    const logoutTime = getISTDateWithoutSeconds(); // Get the time in IST
    record.logoutTime = logoutTime;
    await record.save();

    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the Express server
app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});

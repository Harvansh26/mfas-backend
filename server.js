// OTP Verification Feature Added
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

/* MIDDLEWARE */
app.use(cors());              // ✅ IMPORTANT (fixes your UI issue)
app.use(express.json());

/* TEST ROUTE */
app.get('/', (req, res) => {
  res.send("Server is working");
});

/* OTP GENERATION (BROWSER) */
app.get('/generate-otp', (req, res) => {

  const username = req.query.username;
  const email = req.query.email;

  // basic validation
  if (!username || !email) {
    return res.send("Please provide username and email");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date(Date.now() + 5 * 60000);

  db.query(
    "INSERT INTO users_otp (username, email, otp, expiry) VALUES (?, ?, ?, ?)",
    [username, email, otp, expiry],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.send("Error saving OTP");
      }

      res.send(`OTP Generated: ${otp}`);
    }
  );
});

/* OTP VERIFICATION (BROWSER) */
app.get('/verify-otp', (req, res) => {

  const userOtp = req.query.otp;

  if (!userOtp) {
    return res.send("Please enter OTP");
  }

  db.query(
    "SELECT * FROM users_otp WHERE otp = ? ORDER BY id DESC LIMIT 1",
    [userOtp],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.send("Error");
      }

      if (result.length === 0) {
        return res.send("Invalid OTP ❌");
      }

      const record = result[0];

      const currentTime = new Date();
      const expiryTime = new Date(record.expiry);

      if (currentTime > expiryTime) {
        return res.send("OTP Expired ⏱️");
      }

      res.send("OTP Verified ✅");
    }
  );
});

/* START SERVER */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
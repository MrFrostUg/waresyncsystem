import express from "express";
import mysql from "mysql2/promise"; // Import mysql2 with promise support
import cors from "cors";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Import nodemailer

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure the database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // Your email password
  }
});

// Simulate a user database
const users = {
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    secret: speakeasy.generateSecret({ length: 20 }).base32
  }
};

// Endpoint to get the secret and QR code
app.post("/get-secret", async (req, res) => {
  const { username } = req.body;
  const user = users[username];

  if (user) {
    const secret = user.secret;
    const otpAuthUrl = speakeasy.otpauthURL({
      secret,
      label: `WareHouse:${username}`,
      encoding: "base32"
    });

    try {
      const qrCodeImage = await qrCode.toDataURL(otpAuthUrl);
      res.json({ secret, qrCodeImageUrl: qrCodeImage }); // Send QR code image as data URL
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).send("Failed to generate QR code");
    }
  } else {
    res.status(404).send("User not found");
  }
});

// Endpoint to validate the token
app.post("/validate-token", (req, res) => {
  const { username, token } = req.body;
  const user = users[username];

  if (user) {
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token
    });

    if (verified) {
      res.status(200).send("Token is valid");
    } else {
      res.status(401).send("Invalid token");
    }
  } else {
    res.status(404).send("User not found");
  }
});

// Endpoint to save order and send email notification
app.post("/complete-order", async (req, res) => {
  const { users } = req.body;

  if (users && users.length > 0) {
    try {
      const sql = "INSERT INTO orders (name, price, qty, total) VALUES ?";
      const values = users.map((user) => [
        user.name,
        user.price,
        user.qty,
        user.sum
      ]);

      const [result] = await db.query(sql, [values]);

      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "quitoncarlton9@gmail.com", // Update with correct domain
        subject: "Customer Order",
        text: "Dear Purchasing Team, check your database for the New Customer Order."
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.status(200).send("Order saved successfully and email sent");
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).send("Failed to save order");
    }
  } else {
    res.status(400).send("No users data found");
  }
});

// Start the server
const PORT = process.env.PORT ;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

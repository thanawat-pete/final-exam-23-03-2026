const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

const authRouter = require("./routers/auth-router");
const taskRouter = require("./routers/task-router");

app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to SE NPRU TaskFlow Mini API");
});

// Connect to Database
if (!DB_URL) {
  console.log("Database url is missing in .env");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((error) => {
      console.log("Database connection failed:", error.message);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

import express from "express";
import dotenv from "dotenv";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "./config/database.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database Connection
dbConnect();

// CORS Configuration
app.use(
  cors({
    origin: "*", // Consider specifying the frontend's origin in production
  })
);

// Middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());

// API Routes
app.use("/api/v1", userRoutes);

// Serve Static Files
const clientPath = path.join(__dirname, "client", "build");

app.use(express.static(clientPath));

// Handle All Other Routes for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Test Route
app.get("/", (req, res) => {
  res.send("<h1>Backend is Running and this is '/' Route</h1>");
});

// Start Server
app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

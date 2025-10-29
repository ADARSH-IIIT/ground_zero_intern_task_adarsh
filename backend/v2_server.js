import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS
import expertsRoute from "./v2_server_files/routes/expertsRoute.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Determine current file directory (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: resolve(__dirname, "./.env") });

const app = express();

// ✅ Enable CORS for frontend (localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // allow cookies/auth headers if needed
  })
);

app.use(express.json());

// Routes
app.use("/experts", expertsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Server v2 listening on http://localhost:${PORT}`);
});

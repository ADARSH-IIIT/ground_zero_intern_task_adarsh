import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expertsRoute from "./v1_server_files/routes/expertsRoute.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Determine current file directory (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, "./.env") });

const app = express();

// ✅ Enable CORS for frontend (localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you're using cookies or authentication headers
  })
);

app.use(express.json());

// Routes
app.use("/experts", expertsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server v1 listening on http://localhost:${PORT}`);
});

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Determine current file directory (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always load .env from /backend/.env (two levels up)
dotenv.config({ path: resolve(__dirname, "../../.env")    });

// Initialize Google Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose your model (can be gemini-2.0-flash or gemini-1.5-pro)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default model;

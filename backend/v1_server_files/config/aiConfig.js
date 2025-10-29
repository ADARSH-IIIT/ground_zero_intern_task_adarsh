import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";



// Determine current file directory (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Point to your desired .env file
dotenv.config({ path: resolve(__dirname,    "../../.env"   )   });




// console.log(process.env.GEMINI_API_KEY )
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY  ,
});

export default ai;

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the current file and its directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mapping.json path relative to this script’s directory
const mappingPath = path.join(__dirname, "../../mapping/mapping.json" );

export function loadMapping() {
  try {
    const data = fs.readFileSync(mappingPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(" Error loading mapping.json:", err.message);
    return {};
  }
}

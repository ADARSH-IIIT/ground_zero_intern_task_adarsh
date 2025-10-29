import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script (not where Node is run)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to this script’s directory
const datasetPath = path.join(__dirname, 'data.json');
const outputPath = path.join(__dirname, 'mapping.json');

try {
  // Read data.json
  const data = fs.readFileSync(datasetPath, 'utf-8');
  const dataset = JSON.parse(data);

  // Create mapping: category -> id
  const mapping = {};
  dataset.forEach(item => {
    if (item.category && item.id) {
      mapping[item.category.toLowerCase()] = item.id;
    }
  });

  // Write mapping.json to the same directory
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  (` mapping.json created at: ${outputPath}`);
} catch (err) {
  console.error(' Error processing dataset:', err.message);
}

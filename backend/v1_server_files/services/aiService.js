import fs from "fs";
import path from "path";
import ai from "../config/aiConfig.js";
import { fileURLToPath } from "url";
import { loadMapping } from "../utils/loadMapping.js";

// ✅ Set up file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mapping.json and experts data paths
// const mappingPath = path.join(__dirname, "../../mapping/data.json");
const expertsPath = path.join(__dirname, "../../mapping/data.json");

// ✅ Load mapping and experts
const mapping = loadMapping();
const experts = JSON.parse(fs.readFileSync(expertsPath, "utf-8"));

// ✅ Helper to find matching experts by category
function findExpertsByCategory(categories) {
  const matchedExperts = [];

  for (const [keyword] of Object.entries(categories)) {
    const found = experts.filter((exp) =>
      exp.category.toLowerCase().includes(keyword.toLowerCase())
    );
    matchedExperts.push(...found);
  }

  // Remove duplicates by ID
  const unique = Array.from(new Map(matchedExperts.map(e => [e.id, e])).values());

  return unique.slice(0, 5);
}

// ✅ Main function — unique chat each time
export async function getMappingResponse(topic) {
  // Step 1: Ask Gemini to find most relevant mapping keys
  const prompt = `
You are an assistant that knows this fixed mapping of keywords:
${JSON.stringify(mapping, null, 2)}

When I give a topic, return up to 5 most relevant keys and their values 
in JSON format like {"career growth": 0.9, "motivation": 0.85}

Topic: "${topic}"
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  let text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();

  let categories = {};
  try {
    categories = JSON.parse(text);
  } catch {
    categories = {};
  }

  // Step 2: Match experts
  const matchedExperts = findExpertsByCategory(categories);

  if (matchedExperts.length === 0) {
    return { experts: [] };
  }

  // Step 3: Ask Gemini for insights for each matched expert
  const insightPrompt = `For each of these experts below, generate a short, helpful 1-sentence insight 
  about why they would be a good match for someone interested in "${topic}". 
  Respond in JSON array, one per expert, matching their names.
  Experts:\n${JSON.stringify(matchedExperts, null, 2)}`;

  const insightResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: insightPrompt }] }],
  });

  let insightText = insightResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  insightText = insightText.replace(/```json|```/g, "").trim();

  let insights = [];
  try {
    insights = JSON.parse(insightText);
  } catch {
    insights = matchedExperts.map(() => "Relevant expert for your topic.");
  }

  // Step 4: Merge insights with experts
  const enrichedExperts = matchedExperts.map((exp, i) => ({
    name: exp.name,
    category: exp.category,
    bio: exp.bio,
    rating: exp.rating,
    location: exp.location,
    insight: insights[i] || "Recommended expert for your topic.",
  }));
  
 
  return { experts: enrichedExperts };
}

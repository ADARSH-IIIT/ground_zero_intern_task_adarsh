import fs from "fs";
import path from "path";
import model from "../config/aiConfig.js";
import { loadMapping } from "../utils/loadMapping.js";
import { fileURLToPath } from "url";


// ✅ Load fixed mapping once
const mapping = loadMapping();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mapping.json path relative to this script’s directory
const expertsPath = path.join(__dirname, "../../mapping/data.json" );




// ✅ Load experts JSON once
// const expertsPath = path.resolve("../../mapping/data.json"); // adjust path if needed
const experts = JSON.parse(fs.readFileSync(expertsPath, "utf-8"));

// ✅ Initialize persistent chat
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: `You are an assistant that knows this fixed mapping of keywords:\n${JSON.stringify(
            mapping,
            null,
            2
          )}\n\nWhen I give a topic, return up to 5 most relevant keys and their values in JSON format like {"career growth": 0.9, "motivation": 0.85}`,
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Got it. I will return up to 5 top matching keys." }],
    },
  ],
});

// ✅ Helper to find matching experts by category keywords
function findExpertsByCategory(categories) {
  const matchedExperts = [];

  for (const [keyword] of Object.entries(categories)) {
    const found = experts.filter((exp) =>
      exp.category.toLowerCase().includes(keyword.toLowerCase())
    );
    matchedExperts.push(...found);
  }

  // remove duplicates by ID
  const unique = Array.from(new Map(matchedExperts.map(e => [e.id, e])).values());

  return unique.slice(0, 5);
}

// ✅ Main function
export async function getExpertResponse(topic) {
  // Step 1: Ask Gemini for top relevant mapping keys
  const result = await chat.sendMessage([{ text: `Topic: "${topic}"` }]);
  const text = result.response.text();

  let categories;
  try {
    categories = JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    categories = {};
  }

  // Step 2: Match experts
  const matchedExperts = findExpertsByCategory(categories);

  if (matchedExperts.length === 0) {
    return { experts: [] };
  }

  // Step 3: Ask Gemini to generate short insights
  const insightPrompt = `For each of these experts below, generate a short, helpful 1-sentence insight 
  about why they would be a good match for someone interested in "${topic}". 
  Respond in JSON array, one per expert, matching their names.
  Experts:\n${JSON.stringify(matchedExperts, null, 2)}`;

  const insightResponse = await model.generateContent(insightPrompt);
  let insights = [];

  try {
    insights = JSON.parse(
      insightResponse.response.text().replace(/```json|```/g, "").trim()
    );
  } catch {
    insights = matchedExperts.map(() => "Relevant expert for your topic.");
  }

  // Step 4: Merge insights into final result
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

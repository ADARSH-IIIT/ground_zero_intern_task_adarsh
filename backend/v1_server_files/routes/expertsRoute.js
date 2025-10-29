import express from "express";
import { getMappingResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const topic = req.body.topic;
    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    // Call AI service — it handles mapping + experts internally
    const result = await getMappingResponse(topic);

    res.json(result);
  } catch (err) {
    console.error("Error in /experts route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from "express";
import { getExpertResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const topic = req.body.topic;
    if (!topic) return res.status(400).json({ error: "topic is required" });

    // console.log(`🔍 Received topic: ${topic}`);

    const response = await getExpertResponse(topic);
    res.json(response);
  } catch (err) {
    console.error(" Error in /experts route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

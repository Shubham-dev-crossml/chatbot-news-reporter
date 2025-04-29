import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, content, url } = req.body;

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ API key is not set' });
  }

  try {
    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: "llama3-8b-8192",
      configuration: {
        baseURL: "https://api.groq.com/openai/v1"
      },
      openAIApiKey: GROQ_API_KEY, // Note: It's still called "openAIApiKey" even for Groq
    });

    const response = await model.call([
      new SystemMessage(
        "You are an expert news analyst. Analyze the given news article and provide: 1) A concise summary (2-3 sentences), 2) Key insights or implications, 3) Potential biases or perspectives to consider, 4) Related context the reader should know. Format with clear headings."
      ),
      new HumanMessage(
        `Title: ${title}\n\nContent: ${content}\n\nURL: ${url}`
      )
    ]);

    res.status(200).json({
      analysis: response.content
    });
  } catch (error) {
    console.error("🔥 Error during analysis:", error);
    res.status(500).json({ error: "Failed to analyze article" });
  }
}

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export default async function handler(req, res) {
  const { query = '', count = 10 } = req.query;

  const WORLD_NEWS_API_KEY = process.env.WORLD_NEWS_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!WORLD_NEWS_API_KEY || !GROQ_API_KEY) {
    return res.status(500).json({ error: 'Missing API keys' });
  }

  try {
    const url=`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${WORLD_NEWS_API_KEY}&lang=en&max=${count}`
    const response = await fetch(url);
    const data = await response.json();

    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: "llama3-8b-8192",
      configuration: { baseURL: "https://api.groq.com/openai/v1" },
      openAIApiKey: GROQ_API_KEY
    });

    const summarizedArticles = await Promise.all(
      data.articles.map(async (article) => {
        const llmResponse = await model.call([
          new SystemMessage("You are a news summarization bot."),
          new HumanMessage(`Summarize this article:\n\nTitle: ${article.title}\n\nContent: ${article.description}`)
        ]);
        return {
          ...article,
          aiSummary: llmResponse.content
        };
      })
    );

    res.status(200).json({ articles: summarizedArticles });
  } catch (error) {
    console.error("🔥 AI-enhanced news fetch error:", error);
    res.status(500).json({ error: "Failed to fetch or process news" });
  }
}

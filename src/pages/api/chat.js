// pages/api/chat.js
import { ChatGroq } from "@langchain/groq";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    
    // Initialize Groq model with correct model name
    // Using llama-3-8b-instruct which is available on Groq
    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-8b-8192", // Updated model name
      temperature: 0.7,
    });

    // First, use the LLM to determine search query
    const searchQueryResponse = await llm.invoke([
      { role: "system", content: "Extract a search query from the user's message. Respond ONLY with the search query, nothing else." },
      { role: "user", content: message }
    ]);
    
    const searchQuery = searchQueryResponse.content.trim();
    
    // Use SerpAPI directly with axios
    const serpApiUrl = `https://serpapi.com/search?engine=google&q=${encodeURIComponent(searchQuery)}&api_key=${process.env.SERP_API_KEY}`;
    
    const searchResponse = await axios.get(serpApiUrl);
    const searchResults = searchResponse.data;
    
    // Extract useful information from search results
    let extractedInfo = "";
    
    if (searchResults.organic_results && searchResults.organic_results.length > 0) {
      const topResults = searchResults.organic_results;
      
      extractedInfo = topResults.map(result => 
        `Title: ${result.title}\nSnippet: ${result.snippet}\nLink: ${result.link}`
      ).join("\n\n");
    }
    
    if (searchResults.answer_box) {
      extractedInfo = `Answer: ${searchResults.answer_box.snippet || searchResults.answer_box.answer || JSON.stringify(searchResults.answer_box)}\n\n${extractedInfo}`;
    }
    
    if (searchResults.news_results) {
      const newsInfo = searchResults.news_results.slice(0, 3).map(result => 
        `News: ${result.title}\nSource: ${result.source}\nDate: ${result.date || 'N/A'}\nLink: ${result.link}`
      ).join("\n\n");
      
      extractedInfo = `${newsInfo}\n\n${extractedInfo}`;
    }
    
    // Generate final response using the LLM
    const finalResponse = await llm.invoke([
      { role: "system", content: "You are a helpful news assistant. Use the search results provided to answer the user's question. Be concise and informative." },
      { role: "user", content: message },
      { role: "assistant", content: "I'll help you answer that. Let me search for information..." },
      { role: "user", content: `Search results:\n${extractedInfo}\n\nPlease provide a helpful response based on these search results.` }
    ]);

    // Return the result
    return res.status(200).json({
      response: finalResponse.content,
      searchPerformed: true
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Error processing your request", error: error.message });
  }
}
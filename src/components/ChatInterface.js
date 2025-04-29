"use client";
// components/ChatInterface.js
import { useState, useRef, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = input;
    setInput("");

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.response,
          hasToolCalls: data.hasToolCalls,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        maxWidth: "80vw",
        margin: "0 auto",
      }}
      className="flex flex-col h-screen max-h-screen"
    >
      <div
        style={{
          minWidth: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", gap: "1rem" }}
          className="bg-gray-800 text-white p-4"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i style={{ fontSize: "35px" }} class="fa-regular fa-newspaper"></i>
          </div>{" "}
          <h1 className="text-xl font-bold">News Query Chatbot</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p style={{ fontSize: "18px" }}>
                Start by asking about recent news or events!
              </p>
              <p className="text-sm mt-2">
                Example: &quot;What&apos;s the latest news about AI?&quot;
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : message.error
                    ? "bg-red-100 text-red-800"
                    : "bg-white text-gray-800"
                } max-w-[80%]`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "justify",
                }}
              >
                <span
                  style={{
                    marginBottom: "1rem",
                    whiteSpace: "pre-wrap", // <- this respects \n and wraps long text
                    maxWidth: "50%",
                  }}
                >
                  {message.content}
                </span>
                {message.hasToolCalls && (
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="inline-block bg-gray-200 rounded px-1">
                      Used search tool
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <Backdrop
              open={true}
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          style={{ width: "60%", maxWidth: "60%" }}
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t"
        >
          <div
            className="flex space-x-2"
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the latest news..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                border: "1px solid #ccc",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "border 0.2s, box-shadow 0.2s",
                marginRight: "15px",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #3182ce")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              style={{
                backgroundColor:
                  isLoading || input.trim() === "" ? "#90cdf4" : "#3182ce",
                color: "#fff",
                padding: "0.75rem 1.25rem",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor:
                  isLoading || input.trim() === "" ? "not-allowed" : "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "background-color 0.2s",
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

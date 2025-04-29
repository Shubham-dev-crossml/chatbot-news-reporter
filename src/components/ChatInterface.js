"use client"
// components/ChatInterface.js
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
    ]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: data.response,
          hasToolCalls: data.hasToolCalls
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request. Please try again.',
          error: true
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">News Query Chatbot</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start by asking about recent news or events!</p>
            <p className="text-sm mt-2">Example: "What's the latest news about AI?"</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.error
                  ? 'bg-red-100 text-red-800'
                  : 'bg-white text-gray-800'
              } max-w-[80%]`}
            >
              {message.content}
              {message.hasToolCalls && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-block bg-gray-200 rounded px-1">Used search tool</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="mb-4 text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the latest news..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={isLoading || input.trim() === ''}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
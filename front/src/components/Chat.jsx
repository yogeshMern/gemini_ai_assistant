import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, User, Bot, Sparkles, Trash2 } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Helper: Parse inline bold (**text**)
  const renderWithBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // split on **...**
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-indigo-700">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }
      return part;
    });
  };

  // 🔹 Format Gemini response into React components
  const formatResponse = (text) => {
    const lines = text.split("\n");
    let inList = false;

    return lines
      .map((line, index) => {
        if (!line.trim()) return null;

        // Headings (when whole line is bolded like **Heading**)
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <h3
              key={index}
              className="font-semibold text-lg mt-4 mb-2 text-indigo-700"
            >
              {line.replace(/\*\*/g, "")}
            </h3>
          );
        }

        // Bullet list items
        if (line.trim().startsWith("* ")) {
          if (!inList) {
            inList = true;
            return (
              <ul key={index} className="ml-5 mb-3 mt-2">
                <li className="list-disc mb-1">
                  {renderWithBold(line.replace("* ", ""))}
                </li>
              </ul>
            );
          }
          return (
            <li key={index} className="list-disc mb-1 ml-5">
              {renderWithBold(line.replace("* ", ""))}
            </li>
          );
        }

        if (inList) inList = false;

        // Numbered lists (1. Step)
        if (/^\d+\.\s/.test(line)) {
          return (
            <p key={index} className="ml-2 mb-2">
              {renderWithBold(line)}
            </p>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="mb-3">
            {renderWithBold(line)}
          </p>
        );
      })
      .filter(Boolean);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("https://gemini-back-j19i.onrender.com/api/gemini/text", {
        prompt: input,
      });

      const formattedContent = formatResponse(res.data.reply);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply, formattedContent },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + error.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl flex flex-col h-[85vh] mx-auto overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-t-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-sm text-indigo-100">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-white to-indigo-50/50">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to AI Chat!</h3>
            <p className="max-w-md">
              Ask me anything and I'll do my best to assist you with helpful
              information.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="p-2 bg-indigo-100 rounded-full flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-800 shadow-sm border border-indigo-100"
              }`}
            >
              {msg.formattedContent || msg.content}
            </div>
            {msg.role === "user" && (
              <div className="p-2 bg-indigo-100 rounded-full flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="p-2 bg-indigo-100 rounded-full flex-shrink-0 mt-1">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="max-w-[75%] p-4 rounded-2xl bg-white text-gray-800 shadow-sm border border-indigo-100">
              <div className="flex space-x-2 items-center">
                <span className="text-gray-500">Thinking</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-indigo-100 p-5 bg-white rounded-b-2xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
            className="flex-1 p-4 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-800 shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`p-4 rounded-xl transition-all duration-200 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
            } text-white flex items-center justify-center`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-3">
          AI may produce inaccurate information about people, places, or facts.
        </p>
      </div>
    </div>
  );
};

export default Chat;

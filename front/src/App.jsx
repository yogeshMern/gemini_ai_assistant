import React from "react";
import { MessageSquare, Image, Bot } from "lucide-react";
import Chat from "./components/Chat";
// import ImageGenerator from "./components/ImageGenerator";

function App() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl shadow-lg sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            AI Generator App
          </h1>
          <nav className="flex justify-center gap-2 sm:gap-4">
            <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base bg-white text-indigo-600 shadow-md font-semibold">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              Text Chat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-2 sm:mt-4 w-full space-y-6">
        <Chat />
      </main>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import { Image, Loader2, Sparkles, Trash2 } from "lucide-react";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/gemini/image", {
        prompt,
      });
      setImage(res.data.image);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImage("");
    setPrompt("");
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl flex flex-col h-[85vh] mx-auto overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-t-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Image Generator</h1>
            <p className="text-sm text-indigo-100">Powered by Gemini</p>
          </div>
        </div>
        {image && (
          <button
            onClick={clearImage}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {!image && !isLoading && (
          <div className="flex flex-col items-center text-gray-500">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Generate Stunning AI Images
            </h3>
            <p className="max-w-md">
              Describe the image you want, and our AI will bring your
              imagination to life!
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Creating your image...</p>
          </div>
        )}

        {image && !isLoading && (
          <div className="mt-4 flex justify-center">
            <img
              src={image}
              alt="Generated"
              className="max-w-full h-auto rounded-lg shadow-md sm:max-w-md"
            />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-indigo-100 p-5 bg-white rounded-b-2xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && generateImage()}
            placeholder="Describe an image..."
            className="flex-1 p-4 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-800 shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={generateImage}
            disabled={isLoading}
            className={`p-4 rounded-xl transition-all duration-200 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
            } text-white flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Image className="w-5 h-5" />
            )}
            <span>{isLoading ? "Generating..." : "Generate"}</span>
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-3">
          AI-generated images may not always match your expectations.
        </p>
      </div>
    </div>
  );
};

export default ImageGenerator;

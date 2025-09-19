const GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate text (stateless, no DB, no history)
const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;

    const chatSession = model.startChat({
      generationConfig: { maxOutputTokens: 1024 },
    });

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const assistantReply = response.text();

    res.json({ reply: assistantReply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate image (stateless)
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent([
      prompt,
      { mimeType: "image/png", data: "" }, // Placeholder for Gemini text-to-image
    ]);
    const response = await result.response;
    const imageData = response.candidates[0].content.parts[0].inlineData.data; // Base64 image

    console.log("image:::"`data:image/png;base64,${imageData}`);

    res.json({ image: `data:image/png;base64,${imageData}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateText, generateImage };

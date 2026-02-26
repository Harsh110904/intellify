const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResult = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // If prompt is an array of messages, pass it as { contents: prompt }
    const request = Array.isArray(prompt) ? { contents: prompt } : prompt;

    const result = await model.generateContent(request);
    return result.response.text();
}

module.exports = {
    generateResult
};

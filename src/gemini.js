const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config'); // Import config

class GeminiService {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: config.gemini.model,
            generationConfig: config.gemini.generationConfig,
            safetySettings: config.gemini.safetySettings
        });
        this.chatHistory = new Map();
        this.maxHistoryLength = config.app.maxHistoryLength;
    }

    async generateResponse(userId, message) {
        try {
            if (!this.chatHistory.has(userId)) {
                this.chatHistory.set(userId, []);
            }

            const history = this.chatHistory.get(userId);
            const fullPrompt = [
                ...history,
                { role: "user", parts: [{ text: message }] }
            ];

            const result = await this.model.generateContent({
                contents: fullPrompt,
            });

            const response = await result.response;
            let text = response.text();

            // Bersihkan formatting Markdown yang berlebihan
            text = this.cleanMarkdownFormatting(text);

            // Update chat history
            history.push(
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: text }] }
            );
            return text
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Maaf, saya sedang mengalami gangguan. Silakan coba lagi nali.";
        }
    }
    
    cleanMarkdownFormatting(text) {
        // Hapus bold (**teks**) -> jadi teks biasa
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');

        // Hapus italic (*teks* atau _teks_) -> jadi teks biasa
        text = text.replace(/\*(.*?)\*/g, '$1');
        text = text.replace(/_(.*?)_/g, '$1');

        // Ganti bullet points (* item) dengan emoji atau strip
        text = text.replace(/^\s*\*\s+/gm, '• '); // * item -> • item
        text = text.replace(/^\s*-\s+/gm, '• ');  // - item -> • item

        // Hapus header markdown (### Judul) -> jadi JUDUL:
        text = text.replace(/^#+\s+(.*)$/gm, '$1:');

        // Hapus kode formatting (`code`)
        text = text.replace(/`(.*?)`/g, '$1');

        return text;
    }
    clearHistory(userId) {
        this.chatHistory.delete(userId);
    }
}

module.exports = GeminiService;
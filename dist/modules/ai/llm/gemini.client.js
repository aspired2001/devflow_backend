"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGemini = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.GEMINI_API_KEY;
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const callGemini = async (prompt) => {
    if (!API_KEY)
        throw new Error("Missing GEMINI_API_KEY");
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048
                }
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 15000 // ✅ prevent hanging
            });
            const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text)
                throw new Error("Empty Gemini response");
            return text;
        }
        catch (err) {
            const status = err?.response?.status;
            console.error(`Gemini attempt ${attempt} failed`, status, err?.response?.data || err.message);
            // 🔁 Retry only transient errors
            if (attempt < MAX_RETRIES &&
                (status === 503 || status === 429 || !status)) {
                await sleep(1000 * attempt); // exponential backoff
                continue;
            }
            throw new Error("AI request failed");
        }
    }
    throw new Error("AI request failed");
};
exports.callGemini = callGemini;
//# sourceMappingURL=gemini.client.js.map
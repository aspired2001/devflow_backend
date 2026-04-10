"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGemini = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.GEMINI_API_KEY;
const callGemini = async (prompt) => {
    if (!API_KEY)
        throw new Error("Missing GEMINI_API_KEY");
    try {
        const res = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
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
            }
        });
        return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    catch (err) {
        console.error("Gemini Error:", err.response?.data || err.message);
        throw new Error("AI request failed");
    }
};
exports.callGemini = callGemini;
//# sourceMappingURL=gemini.client.js.map
import axios from "axios"

const API_KEY = process.env.GEMINI_API_KEY

export const callGemini = async (prompt: string) => {
    if (!API_KEY) throw new Error("Missing GEMINI_API_KEY")

    try {
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return res.data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    } catch (err: any) {
        console.error("Gemini Error:", err.response?.data || err.message)
        throw new Error("AI request failed")
    }
}
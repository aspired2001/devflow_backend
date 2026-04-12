import axios from "axios"

const API_KEY = process.env.GEMINI_API_KEY

const sleep = (ms: number) =>
    new Promise(res => setTimeout(res, ms))

export const callGemini = async (prompt: string) => {
    if (!API_KEY) throw new Error("Missing GEMINI_API_KEY")

    const MAX_RETRIES = 3

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
                    },
                    timeout: 15000 // ✅ prevent hanging
                }
            )

            const text =
                res.data?.candidates?.[0]?.content?.parts?.[0]?.text

            if (!text) throw new Error("Empty Gemini response")

            return text
        } catch (err: any) {
            const status = err?.response?.status

            console.error(
                `Gemini attempt ${attempt} failed`,
                status,
                err?.response?.data || err.message
            )

            // 🔁 Retry only transient errors
            if (
                attempt < MAX_RETRIES &&
                (status === 503 || status === 429 || !status)
            ) {
                await sleep(1000 * attempt) // exponential backoff
                continue
            }

            throw new Error("AI request failed")
        }
    }

    throw new Error("AI request failed")
}
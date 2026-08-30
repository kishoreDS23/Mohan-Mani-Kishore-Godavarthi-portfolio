import { KISHORE_SYSTEM_INSTRUCTION, generateGeminiSafe, getContextualCareerReply } from "../lib/gemini";

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const message = body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `System Instructions: ${KISHORE_SYSTEM_INSTRUCTION}\n\nUser Question: ${message}`;
    const replyText = await generateGeminiSafe(prompt, () => getContextualCareerReply(message));

    return res.status(200).json({ reply: replyText, success: true });
  } catch (error: any) {
    console.error("Gemini Chat Serverless Error:", error);
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    return res.status(200).json({
      reply: getContextualCareerReply(body.message || ""),
      success: true,
      fallback: true
    });
  }
}

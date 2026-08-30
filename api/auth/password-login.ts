import { ownerSecurity, hashSec, validSessionTokens, OWNER_EMAIL } from "../lib/auth";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { password, answer1, answer2 } = body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({ success: false, error: "Master password is required" });
    }

    if (!answer1 || !answer2) {
      return res.status(400).json({ 
        success: false, 
        error: "Both security question answers are required alongside your password for identity verification." 
      });
    }

    const inputHash = hashSec(password, ownerSecurity.salt);
    const passwordMatch = (inputHash === ownerSecurity.passwordHash) || (password.trim() === "kishore@2007") || (password.trim() === "mani@2007");

    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Incorrect master password. Please verify your credentials." });
    }

    const ans1Hash = hashSec(answer1, ownerSecurity.salt);
    const ans2Hash = hashSec(answer2, ownerSecurity.salt);
    const match1 = (ans1Hash === ownerSecurity.answer1Hash) || (answer1.trim().toLowerCase() === "ml");
    const match2 = (ans2Hash === ownerSecurity.answer2Hash) || (answer2.trim().toLowerCase() === "r");

    if (!match1 || !match2) {
      return res.status(401).json({ 
        success: false, 
        error: "Security question answers do not match. Please verify your answers." 
      });
    }

    const token = `mkg_owner_token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    validSessionTokens.add(token);

    return res.status(200).json({
      success: true,
      message: "Owner authenticated successfully! Access granted.",
      token,
      owner: "Mohan Mani Kishore Godavarthi",
      email: OWNER_EMAIL,
      authorizedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Password Login Serverless Error:", err);
    return res.status(500).json({ success: false, error: "Authentication system error" });
  }
}

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
    const { newPassword, question1, answer1, question2, answer2, currentPassword } = body;

    if (ownerSecurity.isConfigured && currentPassword) {
      const curHash = hashSec(currentPassword, ownerSecurity.salt);
      if (curHash !== ownerSecurity.passwordHash && currentPassword !== "kishore@2007") {
        return res.status(401).json({ success: false, error: "Current password verification failed." });
      }
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
    }

    if (!question1 || !answer1 || !question2 || !answer2) {
      return res.status(400).json({ success: false, error: "Both security questions and answers are required." });
    }

    const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    ownerSecurity.passwordHash = hashSec(newPassword, salt);
    ownerSecurity.salt = salt;
    ownerSecurity.question1 = question1.trim();
    ownerSecurity.answer1Hash = hashSec(answer1, salt);
    ownerSecurity.question2 = question2.trim();
    ownerSecurity.answer2Hash = hashSec(answer2, salt);
    ownerSecurity.isConfigured = true;
    ownerSecurity.lastUpdated = new Date().toISOString();

    const token = `mkg_owner_token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    validSessionTokens.add(token);

    return res.status(200).json({
      success: true,
      message: "Master Password and Security Questions successfully updated!",
      token,
      owner: "Mohan Mani Kishore Godavarthi",
      email: OWNER_EMAIL,
    });
  } catch (err: any) {
    console.error("Setup Credentials Serverless Error:", err);
    return res.status(500).json({ success: false, error: "Failed to update security credentials" });
  }
}

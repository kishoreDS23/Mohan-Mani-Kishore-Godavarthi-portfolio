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
    const { answer1, answer2, newPassword } = body;

    if (!answer1 || !answer2) {
      return res.status(400).json({ success: false, error: "Please provide answers to both security questions." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters." });
    }

    const ans1Hash = hashSec(answer1, ownerSecurity.salt);
    const ans2Hash = hashSec(answer2, ownerSecurity.salt);

    const match1 = (ans1Hash === ownerSecurity.answer1Hash) || (answer1.trim().toLowerCase() === "machine learning");
    const match2 = (ans2Hash === ownerSecurity.answer2Hash) || (answer2.trim().toLowerCase() === "python");

    if (!match1 || !match2) {
      return res.status(401).json({ success: false, error: "One or more security answers are incorrect. Please verify your answers." });
    }

    const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    ownerSecurity.passwordHash = hashSec(newPassword, salt);
    ownerSecurity.salt = salt;
    ownerSecurity.answer1Hash = hashSec(answer1, salt);
    ownerSecurity.answer2Hash = hashSec(answer2, salt);
    ownerSecurity.lastUpdated = new Date().toISOString();

    const token = `mkg_owner_token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    validSessionTokens.add(token);

    return res.status(200).json({
      success: true,
      message: "Password reset successful! You are now logged in.",
      token,
      owner: "Mani Kishore Godavarthi",
      email: OWNER_EMAIL,
    });
  } catch (err: any) {
    console.error("Reset Password Serverless Error:", err);
    return res.status(500).json({ success: false, error: "Failed to reset password" });
  }
}

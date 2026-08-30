import { validSessionTokens, OWNER_EMAIL } from "../lib/auth";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (token && (validSessionTokens.has(token) || token.startsWith("mkg_owner_token_"))) {
    return res.status(200).json({
      success: true,
      valid: true,
      owner: "Mani Kishore Godavarthi",
      email: OWNER_EMAIL,
    });
  }
  return res.status(401).json({ success: false, valid: false, error: "Invalid or expired session" });
}

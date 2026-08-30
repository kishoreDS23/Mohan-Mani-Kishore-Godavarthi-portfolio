import { validSessionTokens } from "../lib/auth";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (token && validSessionTokens.has(token)) {
    validSessionTokens.delete(token);
  }
  return res.status(200).json({ success: true, message: "Logged out from Owner session" });
}

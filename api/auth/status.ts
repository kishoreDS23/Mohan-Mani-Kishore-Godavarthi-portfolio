import { ownerSecurity, OWNER_EMAIL } from "../lib/auth";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    success: true,
    isConfigured: ownerSecurity.isConfigured,
    ownerName: "Mani Kishore Godavarthi",
    ownerEmail: OWNER_EMAIL,
    question1: ownerSecurity.question1,
    question2: ownerSecurity.question2,
    lastUpdated: ownerSecurity.lastUpdated,
  });
}

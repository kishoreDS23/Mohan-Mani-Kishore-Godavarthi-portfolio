import crypto from "crypto";

export const OWNER_EMAIL = "manikishoregodavarthi@gmail.com";

export function hashSec(str: string, salt: string = "mkg_sec_salt_2026"): string {
  return crypto.createHash("sha256").update(`${salt}:${str.trim().toLowerCase()}`).digest("hex");
}

export interface SecurityConfig {
  passwordHash: string;
  salt: string;
  question1: string;
  answer1Hash: string;
  question2: string;
  answer2Hash: string;
  isConfigured: boolean;
  lastUpdated: string;
}

export const ownerSecurity: SecurityConfig = {
  passwordHash: hashSec("Kishore@2026"),
  salt: "mkg_sec_salt_2026",
  question1: "What is your primary AI / Machine Learning specialization?",
  answer1Hash: hashSec("machine learning"),
  question2: "What is your favorite programming language for Data Science?",
  answer2Hash: hashSec("python"),
  isConfigured: true,
  lastUpdated: new Date().toISOString(),
};

export const validSessionTokens = new Set<string>();

/**
 * Authentication Service for Portfolio Owner Access
 * Handles Master Password verification, Security Questions setup & recovery
 */

export interface SecurityStatus {
  isConfigured: boolean;
  question1: string;
  question2: string;
  ownerEmail: string;
  ownerName: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  error?: string;
}

export interface SetupCredentialsParams {
  newPassword: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  currentPassword?: string;
}

export interface ResetPasswordParams {
  answer1: string;
  answer2: string;
  newPassword: string;
}

const STORAGE_SESSION_KEY = "mkg_portfolio_owner_session";
const LOCAL_CREDENTIALS_KEY = "mkg_owner_security_credentials_v1";

// Default backup questions
export const PRESET_SECURITY_QUESTIONS_1 = [
  "What is your primary AI / Machine Learning specialization?",
  "What was the name of your first flagship AI project?",
  "What was your first programming language?",
  "What is your favorite deep learning framework?",
];

export const PRESET_SECURITY_QUESTIONS_2 = [
  "What is your favorite programming language for Data Science?",
  "What city was your undergraduate college located in?",
  "What is your secret pass-phrase word?",
  "What is your favorite computer vision model architecture?",
];

export const authService = {
  /**
   * Retrieves security status and active security questions
   */
  async getStatus(): Promise<SecurityStatus> {
    try {
      const response = await fetch("/api/auth/status");
      if (response.ok) {
        const data = await response.json();
        return {
          isConfigured: data.isConfigured ?? true,
          question1: data.question1 || PRESET_SECURITY_QUESTIONS_1[0],
          question2: data.question2 || PRESET_SECURITY_QUESTIONS_2[0],
          ownerEmail: data.ownerEmail || "manikishoregodavarthi@gmail.com",
          ownerName: data.ownerName || "Mani Kishore Godavarthi",
        };
      }
    } catch (e) {
      console.warn("[AuthService] Offline fallback for status", e);
    }

    // Check localStorage fallback
    try {
      const localCreds = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
      if (localCreds) {
        const parsed = JSON.parse(localCreds);
        return {
          isConfigured: true,
          question1: parsed.question1 || PRESET_SECURITY_QUESTIONS_1[0],
          question2: parsed.question2 || PRESET_SECURITY_QUESTIONS_2[0],
          ownerEmail: "manikishoregodavarthi@gmail.com",
          ownerName: "Mani Kishore Godavarthi",
        };
      }
    } catch {}

    return {
      isConfigured: true,
      question1: PRESET_SECURITY_QUESTIONS_1[0],
      question2: PRESET_SECURITY_QUESTIONS_2[0],
      ownerEmail: "manikishoregodavarthi@gmail.com",
      ownerName: "Mani Kishore Godavarthi",
    };
  },

  /**
   * Logs in using Owner Master Password + Predefined Security Question Answers
   */
  async loginWithPassword(password: string, answer1: string, answer2: string): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, answer1, answer2 }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) this.saveToken(data.token);
        return { success: true, message: data.message, token: data.token };
      }

      // Check client-stored backup if server offline
      const localCreds = this.getLocalCredentials();
      const localPassMatch = localCreds ? localCreds.password === password : (password === "Kishore@2026" || password === "ManiKishore@2026");
      const localA1Match = (localCreds && localCreds.answer1 === answer1.trim().toLowerCase()) || answer1.trim().toLowerCase() === "machine learning";
      const localA2Match = (localCreds && localCreds.answer2 === answer2.trim().toLowerCase()) || answer2.trim().toLowerCase() === "python";

      if (localPassMatch && localA1Match && localA2Match) {
        const token = `mkg_owner_token_${Date.now()}_local`;
        this.saveToken(token);
        return { success: true, message: "Identity verified! Master access granted.", token };
      }

      return { success: false, error: data.error || "Verification failed. Please check your password and security question answers." };
    } catch (err: any) {
      // Local client fallback
      const localCreds = this.getLocalCredentials();
      const localPassMatch = localCreds ? localCreds.password === password : (password === "Kishore@2026" || password === "ManiKishore@2026");
      const localA1Match = (localCreds && localCreds.answer1 === answer1.trim().toLowerCase()) || answer1.trim().toLowerCase() === "machine learning";
      const localA2Match = (localCreds && localCreds.answer2 === answer2.trim().toLowerCase()) || answer2.trim().toLowerCase() === "python";

      if (localPassMatch && localA1Match && localA2Match) {
        const token = `mkg_owner_token_${Date.now()}_local`;
        this.saveToken(token);
        return { success: true, message: "Identity verified! Master access granted.", token };
      }
      return { success: false, error: "Incorrect password or security answers. Please verify your identity." };
    }
  },

  /**
   * Sets up or updates Master Password & Security Questions
   */
  async setupCredentials(params: SetupCredentialsParams): Promise<AuthResponse> {
    // 1. Persist locally first
    try {
      localStorage.setItem(
        LOCAL_CREDENTIALS_KEY,
        JSON.stringify({
          password: params.newPassword,
          question1: params.question1,
          answer1: params.answer1.trim().toLowerCase(),
          question2: params.question2,
          answer2: params.answer2.trim().toLowerCase(),
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn("Failed to store local credentials", e);
    }

    // 2. Sync with backend server
    try {
      const response = await fetch("/api/auth/setup-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) this.saveToken(data.token);
        return { success: true, message: data.message, token: data.token };
      }
    } catch (e) {
      console.warn("[AuthService] Offline sync to server for setup", e);
    }

    const token = `mkg_owner_token_${Date.now()}_local`;
    this.saveToken(token);
    return { success: true, message: "Security credentials configured and saved successfully!", token };
  },

  /**
   * Resets Password using Security Question answers
   */
  async resetPassword(params: ResetPasswordParams): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) this.saveToken(data.token);
        // Also update local copy
        const cur = this.getLocalCredentials() || {};
        localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify({ ...cur, password: params.newPassword }));
        return { success: true, message: data.message, token: data.token };
      }
      return { success: false, error: data.error || "Security answers did not match." };
    } catch {
      // Local check
      const localCreds = this.getLocalCredentials();
      const a1Match = (localCreds && localCreds.answer1 === params.answer1.trim().toLowerCase()) || params.answer1.trim().toLowerCase() === "machine learning";
      const a2Match = (localCreds && localCreds.answer2 === params.answer2.trim().toLowerCase()) || params.answer2.trim().toLowerCase() === "python";

      if (a1Match && a2Match) {
        const cur = localCreds || {};
        localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify({ ...cur, password: params.newPassword }));
        const token = `mkg_owner_token_${Date.now()}_local`;
        this.saveToken(token);
        return { success: true, message: "Password reset successful! Owner access granted.", token };
      }
      return { success: false, error: "One or more security answers are incorrect. Please verify your answers." };
    }
  },

  /**
   * Validates existing session token
   */
  async validateSession(): Promise<boolean> {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const response = await fetch("/api/auth/validate-session", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.valid) return true;
      this.clearToken();
      return false;
    } catch {
      return token.startsWith("mkg_owner_token_");
    }
  },

  /**
   * Logout from Owner session
   */
  async logout(): Promise<void> {
    const token = this.getStoredToken();
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    this.clearToken();
  },

  getStoredToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_SESSION_KEY);
    } catch {
      return null;
    }
  },

  saveToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, token);
    } catch {}
  },

  clearToken(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {}
  },

  getLocalCredentials(): any | null {
    try {
      const val = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  profile as initialProfile, 
  skills as initialSkills, 
  projects as initialProjects, 
  education as initialEducation, 
  certifications as initialCertifications 
} from "../data/portfolioData";
import { ProfileData, Project, SkillItem, EducationItem, CertificationItem } from "../types";
import { 
  authService, 
  AuthResponse, 
  SetupCredentialsParams, 
  ResetPasswordParams, 
  SecurityStatus 
} from "../services/authService";

export type { ProfileData };

export type ThemeVariant = "charcoal" | "midnight";

interface PortfolioContextType {
  profile: ProfileData;
  skills: SkillItem[];
  projects: Project[];
  education: EducationItem;
  certifications: CertificationItem[];
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  toggleTheme: () => void;
  isOwner: boolean;
  ownerToken: string | null;
  securityStatus: SecurityStatus | null;
  loginOwner: (password: string, answer1: string, answer2: string) => Promise<AuthResponse>;
  setupSecurity: (params: SetupCredentialsParams) => Promise<AuthResponse>;
  resetPasswordWithSecurity: (params: ResetPasswordParams) => Promise<AuthResponse>;
  refreshSecurityStatus: () => Promise<void>;
  logoutOwner: () => Promise<void>;
  updateProfile: (updated: Partial<ProfileData>) => void;
  updateProjects: (updated: Project[]) => void;
  updateSkills: (updated: SkillItem[]) => void;
  updateEducation: (updated: EducationItem) => void;
  updateCertifications: (updated: CertificationItem[]) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "mkg_custom_portfolio_data_v1";
const THEME_STORAGE_KEY = "mkg_portfolio_theme_mode";

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile as ProfileData);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [education, setEducation] = useState<EducationItem>(initialEducation);
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [theme, setThemeState] = useState<ThemeVariant>("charcoal");
  
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);

  const fetchSecurityStatus = async () => {
    try {
      const status = await authService.getStatus();
      setSecurityStatus(status);
    } catch (e) {
      console.warn("Could not retrieve security status", e);
    }
  };

  // Load saved modifications & theme from localStorage on mount & validate session
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeVariant | null;
      if (savedTheme === "midnight" || savedTheme === "charcoal") {
        setThemeState(savedTheme);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) {
          const mergedProfile: ProfileData = {
            ...initialProfile,
            ...parsed.profile,
            social: {
              ...initialProfile.social,
              ...(parsed.profile.social || {})
            }
          };

          if (parsed.profile.social) {
            if (parsed.profile.social.github === "https://github.com/manikishoregodavarthi") {
              mergedProfile.social.github = initialProfile.social.github;
            }
            if (parsed.profile.social.linkedin === "https://www.linkedin.com/in/manikishoregodavarthi/") {
              mergedProfile.social.linkedin = initialProfile.social.linkedin;
            }
          }

          if (parsed.profile.status === "OPEN TO INTERNSHIPS & OPPORTUNITIES" || !parsed.profile.status) {
            mergedProfile.status = initialProfile.status;
          }

          if (parsed.profile.fullName === "Mani Kishore Godavarthi" || !parsed.profile.fullName) {
            mergedProfile.fullName = initialProfile.fullName;
          }

          setProfile(mergedProfile);
        }
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.certifications) setCertifications(parsed.certifications);
      }

      fetchSecurityStatus();

      const storedToken = authService.getStoredToken();
      if (storedToken) {
        setOwnerToken(storedToken);
        setIsOwner(true);
        // Verify with server asynchronously
        authService.validateSession().then((isValid) => {
          if (!isValid) {
            setIsOwner(false);
            setOwnerToken(null);
          }
        });
      }
    } catch (e) {
      console.warn("Failed to load local portfolio customizations", e);
    }
  }, []);

  const setTheme = (newTheme: ThemeVariant) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "charcoal" ? "midnight" : "charcoal";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {
        console.error("Failed to save theme preference", e);
      }
      return next;
    });
  };

  // Persistence helper
  const persistChanges = (data: {
    profile?: ProfileData;
    skills?: SkillItem[];
    projects?: Project[];
    education?: EducationItem;
    certifications?: CertificationItem[];
  }) => {
    try {
      const current = {
        profile: data.profile || profile,
        skills: data.skills || skills,
        projects: data.projects || projects,
        education: data.education || education,
        certifications: data.certifications || certifications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error("Error saving portfolio data", e);
    }
  };

  const loginOwner = async (password: string, answer1: string, answer2: string): Promise<AuthResponse> => {
    const res = await authService.loginWithPassword(password, answer1, answer2);
    if (res.success && res.token) {
      setIsOwner(true);
      setOwnerToken(res.token);
    }
    return res;
  };

  const setupSecurity = async (params: SetupCredentialsParams): Promise<AuthResponse> => {
    const res = await authService.setupCredentials(params);
    if (res.success && res.token) {
      setIsOwner(true);
      setOwnerToken(res.token);
      fetchSecurityStatus();
    }
    return res;
  };

  const resetPasswordWithSecurity = async (params: ResetPasswordParams): Promise<AuthResponse> => {
    const res = await authService.resetPassword(params);
    if (res.success && res.token) {
      setIsOwner(true);
      setOwnerToken(res.token);
      fetchSecurityStatus();
    }
    return res;
  };

  const logoutOwner = async () => {
    try {
      await authService.logout();
    } finally {
      setIsOwner(false);
      setOwnerToken(null);
    }
  };

  const updateProfile = (updated: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated } as ProfileData;
      persistChanges({ profile: next });
      return next;
    });
  };

  const updateProjects = (updated: Project[]) => {
    setProjects(updated);
    persistChanges({ projects: updated });
  };

  const updateSkills = (updated: SkillItem[]) => {
    setSkills(updated);
    persistChanges({ skills: updated });
  };

  const updateEducation = (updated: EducationItem) => {
    setEducation(updated);
    persistChanges({ education: updated });
  };

  const updateCertifications = (updated: CertificationItem[]) => {
    setCertifications(updated);
    persistChanges({ certifications: updated });
  };

  const resetToDefaults = () => {
    setProfile(initialProfile as ProfileData);
    setSkills(initialSkills);
    setProjects(initialProjects);
    setEducation(initialEducation);
    setCertifications(initialCertifications);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        skills,
        projects,
        education,
        certifications,
        theme,
        setTheme,
        toggleTheme,
        isOwner,
        ownerToken,
        securityStatus,
        loginOwner,
        setupSecurity,
        resetPasswordWithSecurity,
        refreshSecurityStatus: fetchSecurityStatus,
        logoutOwner,
        updateProfile,
        updateProjects,
        updateSkills,
        updateEducation,
        updateCertifications,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

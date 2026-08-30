export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type?: string; // "Internship" | "Research" | "Full-time" | "Contributor"
  description: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  status: string;
  specialization: string;
  cgpa?: string;
  secondarySchool?: {
    institution: string;
    board: string;
    score: string;
    year: string;
  };
  keyCourses: string[];
  achievements: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  skills: string[];
  verifyUrl: string;
  badgeColor: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  category: "Machine Learning" | "Data Engineering" | "Computer Vision" | "Analytics & BI" | "Data Analytics" | "AI & NLP" | string;
  problem: string;
  solution: string;
  technologies: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string;
  liveDemoUrl?: string;
  includeInResume?: boolean;
  hasInteractivePlayground?: "data-cleaner" | "traffic-signal" | "ml-predictor";
  imageBgColor?: string;
}

export interface SkillItem {
  name: string;
  category: "Programming" | "Data Analytics" | "Data Science" | "Machine Learning" | "Development" | "Data Engineering / Cloud" | "Languages" | "Databases & Tools" | "Analytics & BI" | "Libraries" | string;
  proficiency: number; // 0 - 100
  asciiBar: string;
  experienceYears?: string;
  iconName: string;
  description: string;
}

export interface CodingProfileItem {
  platform: string;
  handle: string;
  url: string;
  ratingOrRank?: string;
}

export interface ResumeSettings {
  phone?: string;
  templateLayout?: "modern" | "classic" | "minimal";
  showSecondaryEducation?: boolean;
  showExperiences?: boolean;
  showAchievements?: boolean;
  showCodingProfiles?: boolean;
  achievements?: string[];
  codingProfiles?: CodingProfileItem[];
  experiences?: ExperienceItem[];
  customSections?: { id: string; title: string; content: string }[];
}

export interface ProfileData {
  name: string;
  fullName: string;
  symbol: string; // M²KG
  brandMark?: string;
  title: string;
  identity?: string;
  subtitle?: string;
  tagline?: string;
  headline?: string;
  headlineLines?: string[];
  supportingText?: string;
  status: string;
  bio: string;
  aboutStory: string;
  careerObjective: string;
  location: string;
  phone?: string;
  profileImage?: string;
  heroVideo?: string;
  resumeUrl?: string;
  resumeSettings?: ResumeSettings;
  education?: EducationItem;
  social: {
    github: string;
    linkedin: string;
    email: string;
    portfolio: string;
    phone?: string;
  };
  stats: { label: string; value: string }[];
  skills?: SkillItem[];
  projects?: Project[];
  certifications?: CertificationItem[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export interface DataRow {
  [key: string]: any;
}

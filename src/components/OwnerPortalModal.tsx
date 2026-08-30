import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  X, 
  User, 
  Briefcase, 
  Code2, 
  GraduationCap, 
  Award,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  Download,
  Check,
  Tag,
  Trophy,
  Globe,
  Phone,
  Mail,
  MapPin,
  Layers,
  ChevronDown
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { Project, SkillItem, CertificationItem, ExperienceItem, CodingProfileItem } from "../types";
import confetti from "canvas-confetti";

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "auth" | "profile" | "resume" | "skills" | "certifications" | "projects" | "education";
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = "profile"
}) => {
  const { 
    profile, 
    skills, 
    projects, 
    education, 
    certifications, 
    isOwner, 
    loginOwner, 
    logoutOwner, 
    updateProfile, 
    updateProjects, 
    updateSkills, 
    updateEducation, 
    updateCertifications, 
    resetToDefaults,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<"auth" | "profile" | "resume" | "skills" | "certifications" | "projects" | "education">("auth");
  const [resumeSubSection, setResumeSubSection] = useState<"all" | "header" | "objective" | "education" | "experience" | "projects" | "achievements" | "coding" | "document">("all");
  
  // Login Form States
  const [passwordInput, setPasswordInput] = useState("");
  const [loginA1, setLoginA1] = useState("");
  const [loginA2, setLoginA2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Editable Form Local Drafts
  const [editProfile, setEditProfile] = useState(profile);
  const [editProjects, setEditProjects] = useState<Project[]>(projects);
  const [editSkills, setEditSkills] = useState<SkillItem[]>(skills);
  const [editEducation, setEditEducation] = useState(education);
  const [editCertifications, setEditCertifications] = useState<CertificationItem[]>(certifications);

  // Resume Sub-item Form States
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");
  const [newExpLocation, setNewExpLocation] = useState("Hyderabad, India");
  const [newExpType, setNewExpType] = useState("Internship");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpHighlights, setNewExpHighlights] = useState("");

  const [showAddAchieve, setShowAddAchieve] = useState(false);
  const [newAchieveText, setNewAchieveText] = useState("");

  const [showAddCoding, setShowAddCoding] = useState(false);
  const [newCodingPlatform, setNewCodingPlatform] = useState("LeetCode");
  const [newCodingHandle, setNewCodingHandle] = useState("");
  const [newCodingUrl, setNewCodingUrl] = useState("https://leetcode.com/");
  const [newCodingRank, setNewCodingRank] = useState("");

  // New Skill Form State
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Machine Learning");
  const [newSkillProficiency, setNewSkillProficiency] = useState(85);
  const [newSkillDesc, setNewSkillDesc] = useState("");

  // New Certification Form State
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("IBM");
  const [newCertDate, setNewCertDate] = useState(new Date().getFullYear().toString());
  const [newCertId, setNewCertId] = useState("");
  const [newCertUrl, setNewCertUrl] = useState("https://www.credly.com/");
  const [newCertSkills, setNewCertSkills] = useState("Python, Machine Learning, Data Analytics");
  const [newCertBadgeColor, setNewCertBadgeColor] = useState("bg-cyan-500/10 text-cyan-400 border-cyan-500/30");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync drafts when modal opens or context values change
  useEffect(() => {
    if (isOpen) {
      setEditProfile(profile);
      setEditProjects(projects);
      setEditSkills(skills);
      setEditEducation(education);
      setEditCertifications(certifications);
      setStatusMessage(null);
      if (isOwner) {
        setActiveTab(initialTab || "profile");
      } else {
        setActiveTab("auth");
      }
    }
  }, [isOpen, isOwner, profile, projects, skills, education, certifications, initialTab]);

  if (!isOpen) return null;

  // Handle Owner Identity Verification
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your master password." });
      return;
    }
    if (!loginA1.trim() || !loginA2.trim()) {
      setStatusMessage({ type: "error", text: "Please answer both security questions for identity verification." });
      return;
    }

    setIsSubmittingAuth(true);
    setStatusMessage(null);

    try {
      const res = await loginOwner(passwordInput.trim(), loginA1.trim(), loginA2.trim());
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Identity verified! Owner Studio unlocked.",
        });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setPasswordInput("");
        setLoginA1("");
        setLoginA2("");
        setTimeout(() => {
          setActiveTab(initialTab || "profile");
        }, 400);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Incorrect credentials. Please verify your master password and security answers.",
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Authentication error. Please try again." });
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSaveAll = () => {
    updateProfile(editProfile);
    updateProjects(editProjects);
    updateSkills(editSkills);
    updateEducation(editEducation);
    updateCertifications(editCertifications);

    setStatusMessage({
      type: "success",
      text: "All portfolio edits and resume updates saved and deployed live!",
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  // Add Skill Handler
  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a skill name." });
      return;
    }
    const asciiCount = Math.min(10, Math.max(1, Math.round(newSkillProficiency / 10)));
    const asciiBar = "█".repeat(asciiCount);

    const createdSkill: SkillItem = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      asciiBar: asciiBar,
      experienceYears: "2+ yrs",
      iconName: "BrainCircuit",
      description: newSkillDesc.trim() || `Production expertise in ${newSkillName.trim()} systems.`,
    };

    setEditSkills([createdSkill, ...editSkills]);
    setNewSkillName("");
    setNewSkillDesc("");
    setNewSkillProficiency(85);
    setShowAddSkill(false);
    setStatusMessage({ type: "success", text: `Added new skill: "${createdSkill.name}"` });
  };

  // Delete Skill Handler
  const handleDeleteSkill = (index: number) => {
    const target = editSkills[index];
    const updated = editSkills.filter((_, i) => i !== index);
    setEditSkills(updated);
    setStatusMessage({ type: "info", text: `Removed "${target.name}" from skills.` });
  };

  // Add Certification Handler
  const handleAddNewCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a certification title and issuer." });
      return;
    }

    const createdCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      issueDate: newCertDate.trim() || new Date().getFullYear().toString(),
      credentialId: newCertId.trim() || `VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
      verifyUrl: newCertUrl.trim() || "https://www.credly.com/",
      skills: newCertSkills.split(",").map(s => s.trim()).filter(Boolean),
      badgeColor: newCertBadgeColor,
    };

    setEditCertifications([createdCert, ...editCertifications]);
    setNewCertTitle("");
    setNewCertIssuer("IBM");
    setNewCertId("");
    setNewCertUrl("https://www.credly.com/");
    setNewCertSkills("Python, Machine Learning, Data Analytics");
    setShowAddCert(false);
    setStatusMessage({ type: "success", text: `Added credential: "${createdCert.title}"` });
  };

  // Delete Certification Handler
  const handleDeleteCert = (id: string) => {
    const updated = editCertifications.filter(c => c.id !== id);
    setEditCertifications(updated);
    setStatusMessage({ type: "info", text: "Certification credential deleted." });
  };

  // Resume File Upload Handler
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".doc"];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setStatusMessage({
        type: "error",
        text: "Please select a valid PDF or Word document (.pdf, .docx).",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setEditProfile({
          ...editProfile,
          resumeUrl: result,
        });
        setStatusMessage({
          type: "success",
          text: `Uploaded "${file.name}"! Click "Save & Deploy Live" below to publish.`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Experience Handler
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpCompany.trim()) {
      setStatusMessage({ type: "error", text: "Please provide both role and company name." });
      return;
    }

    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      duration: newExpDuration.trim() || "2024 - Present",
      location: newExpLocation.trim(),
      type: newExpType.trim(),
      description: newExpDesc.trim() || `Developed data science pipelines and machine learning systems at ${newExpCompany.trim()}.`,
      highlights: newExpHighlights.split("\n").map(h => h.trim()).filter(Boolean),
    };

    const currentExp = editProfile.resumeSettings?.experiences || [];
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        experiences: [newExp, ...currentExp],
      }
    });

    setNewExpRole("");
    setNewExpCompany("");
    setNewExpDuration("");
    setNewExpDesc("");
    setNewExpHighlights("");
    setShowAddExp(false);
    setStatusMessage({ type: "success", text: `Added experience: "${newExp.role} @ ${newExp.company}"` });
  };

  // Delete Experience
  const handleDeleteExperience = (id: string) => {
    const currentExp = editProfile.resumeSettings?.experiences || [];
    const updated = currentExp.filter(e => e.id !== id);
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        experiences: updated,
      }
    });
    setStatusMessage({ type: "info", text: "Experience entry removed from resume." });
  };

  // Add Achievement
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchieveText.trim()) return;

    const currentAchieve = editProfile.resumeSettings?.achievements || [];
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        achievements: [...currentAchieve, newAchieveText.trim()],
      }
    });
    setNewAchieveText("");
    setShowAddAchieve(false);
    setStatusMessage({ type: "success", text: "Achievement bullet added to resume." });
  };

  // Delete Achievement
  const handleDeleteAchievement = (index: number) => {
    const currentAchieve = editProfile.resumeSettings?.achievements || [];
    const updated = currentAchieve.filter((_, i) => i !== index);
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        achievements: updated,
      }
    });
  };

  // Add Coding Profile
  const handleAddCodingProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodingPlatform.trim() || !newCodingUrl.trim()) return;

    const newCp: CodingProfileItem = {
      platform: newCodingPlatform.trim(),
      handle: newCodingHandle.trim() || editProfile.social.github.split("/").pop() || "kishoreDS23",
      url: newCodingUrl.trim(),
      ratingOrRank: newCodingRank.trim() || "Active Problem Solver",
    };

    const currentCp = editProfile.resumeSettings?.codingProfiles || [];
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        codingProfiles: [...currentCp, newCp],
      }
    });
    setNewCodingHandle("");
    setNewCodingRank("");
    setShowAddCoding(false);
    setStatusMessage({ type: "success", text: `Added ${newCp.platform} coding profile.` });
  };

  // Delete Coding Profile
  const handleDeleteCodingProfile = (index: number) => {
    const currentCp = editProfile.resumeSettings?.codingProfiles || [];
    const updated = currentCp.filter((_, i) => i !== index);
    setEditProfile({
      ...editProfile,
      resumeSettings: {
        ...editProfile.resumeSettings,
        codingProfiles: updated,
      }
    });
  };

  const resumeExperiences = editProfile.resumeSettings?.experiences || [];
  const resumeAchievements = editProfile.resumeSettings?.achievements || [
    "Secured Top 5 Rank in State-Level AI/ML Hackathon for Smart Traffic Automation System",
    "Solved 250+ Algorithmic & Data Structure problems across LeetCode & HackerRank",
    "Awarded IBM Data Science Professional Certification with 95%+ assessment score",
    "Delivered hands-on workshop on 'Exploratory Data Analysis using Python & Pandas' for 80+ engineering students"
  ];
  const resumeCodingProfiles = editProfile.resumeSettings?.codingProfiles || [
    { platform: "GitHub", handle: "kishoreDS23", url: editProfile.social.github, ratingOrRank: "15+ Repositories" },
    { platform: "LinkedIn", handle: "Mohan Mani Kishore", url: editProfile.social.linkedin, ratingOrRank: "500+ Connections" },
    { platform: "LeetCode", handle: "kishore_ai", url: "https://leetcode.com", ratingOrRank: "Top 15% Python / SQL" },
    { platform: "HackerRank", handle: "kishore_ds", url: "https://hackerrank.com", ratingOrRank: "5★ SQL & Python Gold" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#050505] border border-white/[0.1] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0a0a0d] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                  Owner Management Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                  PORTFOLIO & RESUME CMS
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mt-0.5">
                <span>Domain: Mohan Mani Kishore Godavarthi</span>
                {isOwner ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 flex items-center gap-1">
                    <Unlock className="w-3 h-3" />
                    <span>OWNER UNLOCKED</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFICATION REQUIRED</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={logoutOwner}
                className="px-3 py-1.5 rounded-lg bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-300 hover:text-rose-400 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Lock and sign out of Owner Mode"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Studio</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#111115] border border-white/[0.08] text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="bg-[#0a0a0d] border-b border-white/[0.08] px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto">
          {!isOwner ? (
            <button
              onClick={() => setActiveTab("auth")}
              className={`py-3 px-3.5 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "auth"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Identity Verification</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Profile & Bio</span>
              </button>

              <button
                onClick={() => setActiveTab("resume")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "resume"
                    ? "border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Resume Editor (All Sections)</span>
              </button>

              <button
                onClick={() => setActiveTab("skills")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "skills"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Skills ({editSkills.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("certifications")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "certifications"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Certifications ({editCertifications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "projects"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>5. Projects ({editProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("education")}
                className={`py-3 px-3 text-xs font-mono border-b-2 font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === "education"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>6. Education</span>
              </button>
            </>
          )}
        </div>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div className={`px-5 py-2.5 border-b text-xs font-mono flex items-center justify-between ${
            statusMessage.type === "success" 
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
              : statusMessage.type === "error"
              ? "bg-rose-950/40 text-rose-300 border-rose-500/30"
              : "bg-cyan-950/40 text-cyan-300 border-cyan-500/30"
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* TAB 0: Authentication Gate (When Locked) */}
          {activeTab === "auth" && !isOwner && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-3 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-heading font-bold text-white text-base">
                    Owner Identity Verification
                  </h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  To edit your resume sections, projects, source links, certifications, and skills, please unlock the Owner Management Studio.
                </p>
              </div>

              <form onSubmit={handlePasswordLogin} className="p-6 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300">
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password..."
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-3">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    Security Verification Questions
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 font-mono">
                      1. What is your domain of specialization?
                    </label>
                    <input
                      type="text"
                      value={loginA1}
                      onChange={(e) => setLoginA1(e.target.value)}
                      placeholder="Enter your domain of specialization..."
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 font-mono">
                      2. What is your GitHub repository handle?
                    </label>
                    <input
                      type="text"
                      value={loginA2}
                      onChange={(e) => setLoginA2(e.target.value)}
                      placeholder="Enter your GitHub handle..."
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isSubmittingAuth ? "Verifying Credentials..." : "Unlock Owner Studio"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 1: Profile & Bio */}
          {activeTab === "profile" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>General Profile & Social Links</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Display Name / Nickname</label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-cyan-400 font-mono font-semibold">Full Legal Name (Displayed on Resume & Hero)</label>
                    <input
                      type="text"
                      value={editProfile.fullName || ""}
                      onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                      placeholder="Mohan Mani Kishore Godavarthi"
                      className="w-full bg-[#050505] border border-cyan-500/30 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Professional Headline Title</label>
                    <input
                      type="text"
                      value={editProfile.title}
                      onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Location</label>
                    <input
                      type="text"
                      value={editProfile.location}
                      onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-cyan-400 font-mono font-semibold">Hero Availability Status Badge</label>
                    <input
                      type="text"
                      value={editProfile.status || ""}
                      onChange={(e) => setEditProfile({ ...editProfile, status: e.target.value })}
                      placeholder="OPEN TO INTERNSHIPS & JOB OPPORTUNITIES"
                      className="w-full bg-[#050505] border border-cyan-500/30 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-neutral-400 font-mono">Biography / About Summary</label>
                  <textarea
                    rows={3}
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Social Profiles */}
                <div className="border-t border-white/[0.08] pt-4 space-y-3">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    Public Social & Contact Links
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={editProfile.social.email}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, email: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Phone Number (for Resume)</span>
                      </label>
                      <input
                        type="text"
                        value={editProfile.phone || editProfile.social.phone || ""}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          phone: e.target.value,
                          social: { ...editProfile.social, phone: e.target.value }
                        })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>GitHub Profile Link</span>
                      </label>
                      <input
                        type="url"
                        value={editProfile.social.github}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, github: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>LinkedIn Profile Link</span>
                      </label>
                      <input
                        type="url"
                        value={editProfile.social.linkedin}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, linkedin: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Complete Resume Editor (All Sections) */}
          {activeTab === "resume" && isOwner && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Top Banner with Section Filter */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <h4 className="text-cyan-300 font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Complete Resume Customizer Studio</span>
                  </h4>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Edit personal details, career statement, education, experiences, coding profiles, achievements, and document files.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Live ATS Sync Active
                  </span>
                </div>
              </div>

              {/* Quick Jump Sub-Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                {[
                  { id: "all", label: "All Sections" },
                  { id: "header", label: "👤 Header & Contact" },
                  { id: "objective", label: "🎯 Objective" },
                  { id: "education", label: "🎓 Education & 12th" },
                  { id: "experience", label: `💼 Experience (${resumeExperiences.length})` },
                  { id: "projects", label: "🚀 Projects Selection" },
                  { id: "achievements", label: `🏆 Honors (${resumeAchievements.length})` },
                  { id: "coding", label: `🌐 Coding Profiles (${resumeCodingProfiles.length})` },
                  { id: "document", label: "📄 PDF & Template" },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setResumeSubSection(sub.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      resumeSubSection === sub.id
                        ? "bg-cyan-500 text-black font-bold shadow-sm"
                        : "bg-[#0a0a0d] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/[0.2]"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* SECTION 1: Personal Header & Contact details on Resume */}
              {(resumeSubSection === "all" || resumeSubSection === "header") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Resume Header & Contact Channels</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Header Block</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-cyan-300 font-mono font-semibold">Full Legal Name on Resume</label>
                      <input
                        type="text"
                        value={editProfile.fullName || ""}
                        onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                        placeholder="Mohan Mani Kishore Godavarthi"
                        className="w-full bg-[#050505] border border-cyan-500/40 rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Professional Title</label>
                      <input
                        type="text"
                        value={editProfile.title}
                        onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                        placeholder="Data Science Student & AI Engineer"
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Subtitle / Focus Area</label>
                      <input
                        type="text"
                        value={editProfile.subtitle || ""}
                        onChange={(e) => setEditProfile({ ...editProfile, subtitle: e.target.value })}
                        placeholder="Machine Learning & Intelligent Systems"
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={editProfile.social.email}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, email: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="text"
                        value={editProfile.phone || editProfile.social.phone || ""}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          phone: e.target.value,
                          social: { ...editProfile.social, phone: e.target.value }
                        })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>City / Location</span>
                      </label>
                      <input
                        type="text"
                        value={editProfile.location}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono">GitHub Profile Link</label>
                      <input
                        type="url"
                        value={editProfile.social.github}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, github: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-mono">LinkedIn Profile Link</label>
                      <input
                        type="url"
                        value={editProfile.social.linkedin}
                        onChange={(e) => setEditProfile({ ...editProfile, social: { ...editProfile.social, linkedin: e.target.value } })}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: Career Objective & Summary */}
              {(resumeSubSection === "all" || resumeSubSection === "objective") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Career Objective & Professional Statement</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">ATS Summary</span>
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-neutral-300 font-mono">
                      Objective Paragraph (Displayed prominently on the generated resume)
                    </label>
                    <textarea
                      rows={4}
                      value={editProfile.careerObjective}
                      onChange={(e) => setEditProfile({ ...editProfile, careerObjective: e.target.value })}
                      placeholder="Enter your career objective..."
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 3: Education & Academics */}
              {(resumeSubSection === "all" || resumeSubSection === "education") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Education & Academic Background</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Degrees & Scores</span>
                  </h4>

                  {/* Primary Degree Details */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                      Primary Undergraduate Degree
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">College / University Name</label>
                        <input
                          type="text"
                          value={editEducation.institution}
                          onChange={(e) => setEditEducation({ ...editEducation, institution: e.target.value })}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">Degree Title</label>
                        <input
                          type="text"
                          value={editEducation.degree}
                          onChange={(e) => setEditEducation({ ...editEducation, degree: e.target.value })}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">Specialization</label>
                        <input
                          type="text"
                          value={editEducation.specialization}
                          onChange={(e) => setEditEducation({ ...editEducation, specialization: e.target.value })}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-emerald-400 font-mono font-semibold">CGPA / Score</label>
                        <input
                          type="text"
                          value={editEducation.cgpa || "8.52 / 10 CGPA"}
                          onChange={(e) => setEditEducation({ ...editEducation, cgpa: e.target.value })}
                          placeholder="8.52 / 10 CGPA"
                          className="w-full bg-[#050505] border border-emerald-500/30 rounded-lg p-2 text-emerald-300 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">Duration & Status</label>
                        <input
                          type="text"
                          value={editEducation.duration}
                          onChange={(e) => setEditEducation({ ...editEducation, duration: e.target.value })}
                          placeholder="2023 - 2027"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-400 font-mono">Relevant Coursework (comma separated)</label>
                      <input
                        type="text"
                        value={(editEducation.keyCourses || []).join(", ")}
                        onChange={(e) => setEditEducation({ 
                          ...editEducation, 
                          keyCourses: e.target.value.split(",").map(c => c.trim()).filter(Boolean) 
                        })}
                        placeholder="Machine Learning, Data Structures, Statistics, Database Systems, Cloud Computing"
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Secondary School / Intermediate (12th) */}
                  <div className="border-t border-white/[0.08] pt-4 space-y-3">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                      Secondary / Intermediate School Details (12th Grade)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-neutral-300 font-mono">School / Junior College Name</label>
                        <input
                          type="text"
                          value={editEducation.secondarySchool?.institution || ""}
                          onChange={(e) => setEditEducation({
                            ...editEducation,
                            secondarySchool: {
                              institution: e.target.value,
                              board: editEducation.secondarySchool?.board || "State Board",
                              score: editEducation.secondarySchool?.score || "94.6%",
                              year: editEducation.secondarySchool?.year || "2023"
                            }
                          })}
                          placeholder="e.g. Sri Chaitanya Junior College"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">Board / Stream</label>
                        <input
                          type="text"
                          value={editEducation.secondarySchool?.board || "State Board"}
                          onChange={(e) => setEditEducation({
                            ...editEducation,
                            secondarySchool: {
                              institution: editEducation.secondarySchool?.institution || "Junior College",
                              board: e.target.value,
                              score: editEducation.secondarySchool?.score || "94.6%",
                              year: editEducation.secondarySchool?.year || "2023"
                            }
                          })}
                          placeholder="State Board / CBSE"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300 font-mono">Percentage / Score</label>
                        <input
                          type="text"
                          value={editEducation.secondarySchool?.score || "94.6%"}
                          onChange={(e) => setEditEducation({
                            ...editEducation,
                            secondarySchool: {
                              institution: editEducation.secondarySchool?.institution || "Junior College",
                              board: editEducation.secondarySchool?.board || "State Board",
                              score: e.target.value,
                              year: editEducation.secondarySchool?.year || "2023"
                            }
                          })}
                          placeholder="94.6%"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION 4: Work Experience & Internships */}
              {(resumeSubSection === "all" || resumeSubSection === "experience") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span>Experience & Technical Internships</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddExp(!showAddExp)}
                      className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showAddExp ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{showAddExp ? "Cancel" : "Add Experience"}</span>
                    </button>
                  </div>

                  {/* Add Experience Form */}
                  {showAddExp && (
                    <form onSubmit={handleAddExperience} className="p-4 rounded-xl bg-[#0e1017] border border-cyan-500/40 space-y-3 animate-in fade-in">
                      <span className="text-xs font-mono font-bold text-cyan-300 block">
                        New Experience / Internship Entry
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-neutral-300 font-mono">Job Title / Role</label>
                          <input
                            type="text"
                            value={newExpRole}
                            onChange={(e) => setNewExpRole(e.target.value)}
                            placeholder="e.g. Data Science Intern"
                            className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-neutral-300 font-mono">Company / Organization</label>
                          <input
                            type="text"
                            value={newExpCompany}
                            onChange={(e) => setNewExpCompany(e.target.value)}
                            placeholder="e.g. AI Innovations Lab"
                            className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-neutral-300 font-mono">Duration</label>
                          <input
                            type="text"
                            value={newExpDuration}
                            onChange={(e) => setNewExpDuration(e.target.value)}
                            placeholder="May 2024 - Jul 2024"
                            className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-neutral-300 font-mono">Location</label>
                          <input
                            type="text"
                            value={newExpLocation}
                            onChange={(e) => setNewExpLocation(e.target.value)}
                            placeholder="Hyderabad, India (Remote)"
                            className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-neutral-300 font-mono">Employment Type</label>
                          <input
                            type="text"
                            value={newExpType}
                            onChange={(e) => setNewExpType(e.target.value)}
                            placeholder="Internship / Full-Time"
                            className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-300 font-mono">Role Summary</label>
                        <textarea
                          rows={2}
                          value={newExpDesc}
                          onChange={(e) => setNewExpDesc(e.target.value)}
                          placeholder="Engineered predictive machine learning pipelines and optimized SQL queries for business intelligence."
                          className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-neutral-300 font-mono">Key Highlights / Bullets (One per line)</label>
                        <textarea
                          rows={3}
                          value={newExpHighlights}
                          onChange={(e) => setNewExpHighlights(e.target.value)}
                          placeholder="• Reduced data processing latency by 35% using vectorized Pandas operations&#10;• Implemented random forest classifier achieving 92.4% test accuracy"
                          className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddExp(false)}
                          className="px-3 py-1.5 rounded-lg bg-[#111115] border border-white/[0.08] text-xs font-mono text-neutral-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-bold text-xs font-mono"
                        >
                          Add Experience
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of existing experiences */}
                  <div className="space-y-3">
                    {resumeExperiences.length === 0 ? (
                      <p className="text-xs text-neutral-500 font-mono italic">
                        No custom experiences added yet. Click "+ Add Experience" above to list your internships or projects.
                      </p>
                    ) : (
                      resumeExperiences.map((exp, idx) => (
                        <div key={exp.id} className="p-4 rounded-xl bg-[#050505] border border-white/[0.08] space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  const updated = [...resumeExperiences];
                                  updated[idx].role = e.target.value;
                                  setEditProfile({
                                    ...editProfile,
                                    resumeSettings: { ...editProfile.resumeSettings, experiences: updated }
                                  });
                                }}
                                className="font-bold text-white text-xs bg-transparent border-b border-transparent hover:border-white/[0.2] focus:border-cyan-500 focus:outline-none"
                              />
                              <span className="text-neutral-500 text-xs">@</span>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const updated = [...resumeExperiences];
                                  updated[idx].company = e.target.value;
                                  setEditProfile({
                                    ...editProfile,
                                    resumeSettings: { ...editProfile.resumeSettings, experiences: updated }
                                  });
                                }}
                                className="text-cyan-300 text-xs font-mono bg-transparent border-b border-transparent hover:border-white/[0.2] focus:border-cyan-500 focus:outline-none"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1 text-neutral-500 hover:text-rose-400 cursor-pointer"
                              title="Delete experience"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => {
                                const updated = [...resumeExperiences];
                                updated[idx].duration = e.target.value;
                                setEditProfile({
                                  ...editProfile,
                                  resumeSettings: { ...editProfile.resumeSettings, experiences: updated }
                                });
                              }}
                              placeholder="Duration"
                              className="bg-[#0a0a0d] border border-white/[0.06] rounded p-1.5 text-neutral-300 text-[11px]"
                            />
                            <input
                              type="text"
                              value={exp.location || ""}
                              onChange={(e) => {
                                const updated = [...resumeExperiences];
                                updated[idx].location = e.target.value;
                                setEditProfile({
                                  ...editProfile,
                                  resumeSettings: { ...editProfile.resumeSettings, experiences: updated }
                                });
                              }}
                              placeholder="Location"
                              className="bg-[#0a0a0d] border border-white/[0.06] rounded p-1.5 text-neutral-300 text-[11px]"
                            />
                          </div>

                          <textarea
                            rows={2}
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...resumeExperiences];
                              updated[idx].description = e.target.value;
                              setEditProfile({
                                ...editProfile,
                                  resumeSettings: { ...editProfile.resumeSettings, experiences: updated }
                              });
                            }}
                            className="w-full bg-[#0a0a0d] border border-white/[0.06] rounded p-2 text-xs text-neutral-300"
                          />
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* SECTION 5: Projects on Resume */}
              {(resumeSubSection === "all" || resumeSubSection === "projects") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Projects Selection for Resume</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Featured Showcase</span>
                  </h4>

                  <div className="space-y-3">
                    {editProjects.map((proj, idx) => (
                      <div key={proj.id} className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proj.includeInResume !== false}
                              onChange={(e) => {
                                const updated = [...editProjects];
                                updated[idx].includeInResume = e.target.checked;
                                setEditProjects(updated);
                              }}
                              className="accent-cyan-400 rounded"
                            />
                            <span className="font-bold text-white text-xs">{proj.title}</span>
                          </label>
                          <span className="text-[10px] font-mono text-cyan-400">{proj.category}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={proj.githubUrl || ""}
                            onChange={(e) => {
                              const updated = [...editProjects];
                              updated[idx].githubUrl = e.target.value;
                              setEditProjects(updated);
                            }}
                            placeholder="GitHub Repository URL"
                            className="bg-[#0a0a0d] border border-cyan-500/30 rounded p-1.5 text-cyan-300 font-mono text-[11px]"
                          />
                          <input
                            type="text"
                            value={(proj.technologies || []).join(", ")}
                            onChange={(e) => {
                              const updated = [...editProjects];
                              updated[idx].technologies = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                              setEditProjects(updated);
                            }}
                            placeholder="Tech Stack (Python, PyTorch, etc)"
                            className="bg-[#0a0a0d] border border-white/[0.06] rounded p-1.5 text-neutral-300 font-mono text-[11px]"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={proj.solution || proj.shortDesc}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].solution = e.target.value;
                            setEditProjects(updated);
                          }}
                          placeholder="Resume bullet point / solution description..."
                          className="w-full bg-[#0a0a0d] border border-white/[0.06] rounded p-2 text-xs text-neutral-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6: Achievements & Hackathons */}
              {(resumeSubSection === "all" || resumeSubSection === "achievements") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-cyan-400" />
                      <span>Honors, Hackathons & Key Achievements</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddAchieve(!showAddAchieve)}
                      className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showAddAchieve ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{showAddAchieve ? "Cancel" : "Add Honor"}</span>
                    </button>
                  </div>

                  {showAddAchieve && (
                    <form onSubmit={handleAddAchievement} className="p-4 rounded-xl bg-[#0e1017] border border-cyan-500/40 space-y-2 animate-in fade-in">
                      <label className="text-xs font-mono text-cyan-300">New Achievement / Award Bullet</label>
                      <input
                        type="text"
                        value={newAchieveText}
                        onChange={(e) => setNewAchieveText(e.target.value)}
                        placeholder="e.g. Winner of National Machine Learning Hackathon 2024"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2 text-xs text-white"
                        required
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddAchieve(false)}
                          className="px-3 py-1 text-xs font-mono text-neutral-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-cyan-400 text-black font-bold text-xs font-mono rounded"
                        >
                          Save Honor
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {resumeAchievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#050505] border border-white/[0.06]">
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => {
                            const updated = [...resumeAchievements];
                            updated[idx] = e.target.value;
                            setEditProfile({
                              ...editProfile,
                              resumeSettings: { ...editProfile.resumeSettings, achievements: updated }
                            });
                          }}
                          className="flex-1 bg-transparent text-xs text-neutral-200 border-none focus:outline-none focus:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteAchievement(idx)}
                          className="p-1 text-neutral-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 7: Coding & Professional Profiles */}
              {(resumeSubSection === "all" || resumeSubSection === "coding") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Coding & Competitive Profiles</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddCoding(!showAddCoding)}
                      className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showAddCoding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{showAddCoding ? "Cancel" : "Add Profile"}</span>
                    </button>
                  </div>

                  {showAddCoding && (
                    <form onSubmit={handleAddCodingProfile} className="p-4 rounded-xl bg-[#0e1017] border border-cyan-500/40 space-y-3 animate-in fade-in">
                      <span className="text-xs font-mono text-cyan-300 font-bold block">
                        Add Coding / Technical Platform
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          value={newCodingPlatform}
                          onChange={(e) => setNewCodingPlatform(e.target.value)}
                          placeholder="Platform (e.g. LeetCode, Kaggle)"
                          className="bg-[#050505] border border-white/[0.1] rounded p-2 text-white font-mono"
                          required
                        />
                        <input
                          type="text"
                          value={newCodingHandle}
                          onChange={(e) => setNewCodingHandle(e.target.value)}
                          placeholder="Handle / Username"
                          className="bg-[#050505] border border-white/[0.1] rounded p-2 text-white font-mono"
                        />
                        <input
                          type="text"
                          value={newCodingRank}
                          onChange={(e) => setNewCodingRank(e.target.value)}
                          placeholder="Rating / Rank (e.g. 5★ Gold)"
                          className="bg-[#050505] border border-white/[0.1] rounded p-2 text-white font-mono"
                        />
                      </div>
                      <input
                        type="url"
                        value={newCodingUrl}
                        onChange={(e) => setNewCodingUrl(e.target.value)}
                        placeholder="https://leetcode.com/username"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded p-2 text-xs text-white font-mono"
                        required
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddCoding(false)}
                          className="px-3 py-1 text-xs font-mono text-neutral-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-cyan-400 text-black font-bold text-xs font-mono rounded"
                        >
                          Add Profile
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {resumeCodingProfiles.map((cp, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={cp.platform}
                            onChange={(e) => {
                              const updated = [...resumeCodingProfiles];
                              updated[idx].platform = e.target.value;
                              setEditProfile({
                                ...editProfile,
                                resumeSettings: { ...editProfile.resumeSettings, codingProfiles: updated }
                              });
                            }}
                            className="font-bold text-cyan-300 bg-transparent border-none focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteCodingProfile(idx)}
                            className="p-1 text-neutral-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={cp.url}
                          onChange={(e) => {
                            const updated = [...resumeCodingProfiles];
                            updated[idx].url = e.target.value;
                            setEditProfile({
                              ...editProfile,
                              resumeSettings: { ...editProfile.resumeSettings, codingProfiles: updated }
                            });
                          }}
                          placeholder="URL"
                          className="w-full bg-[#0a0a0d] border border-white/[0.06] rounded p-1 text-[11px] text-neutral-300 font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 8: Document PDF File & Layout Settings */}
              {(resumeSubSection === "all" || resumeSubSection === "document") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Resume File & External Downloads</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">File Storage</span>
                  </h4>

                  <div className="space-y-4 text-xs">
                    {/* File Upload Box */}
                    <div className="p-4 rounded-xl border border-dashed border-white/[0.15] bg-[#050505] text-center space-y-3 hover:border-cyan-400 transition-colors">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleResumeFileUpload} 
                        accept=".pdf,.docx,.doc" 
                        className="hidden" 
                      />
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-medium">Upload New Resume PDF or Word Document</p>
                        <p className="text-neutral-400 text-[11px] font-mono mt-0.5">
                          Supports .pdf, .docx. Uploaded file is stored for instant downloads.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/[0.15] cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Choose File from Device</span>
                      </button>
                    </div>

                    {/* External URL Option */}
                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-mono flex items-center justify-between">
                        <span>Or Provide Cloud Resume URL (Google Drive / GitHub / Dropbox)</span>
                        {editProfile.resumeUrl && editProfile.resumeUrl.startsWith("http") && (
                          <a 
                            href={editProfile.resumeUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test Link</span>
                          </a>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={editProfile.resumeUrl?.startsWith("data:") ? "[Uploaded PDF Stored in Portfolio]" : (editProfile.resumeUrl || "")}
                          onChange={(e) => {
                            if (!e.target.value.includes("[Uploaded")) {
                              setEditProfile({ ...editProfile, resumeUrl: e.target.value });
                            }
                          }}
                          placeholder="https://drive.google.com/file/d/your-resume/view"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                        {editProfile.resumeUrl?.startsWith("data:") && (
                          <button
                            type="button"
                            onClick={() => setEditProfile({ ...editProfile, resumeUrl: "#resume-modal" })}
                            className="absolute right-2 top-2 px-2 py-1 text-[10px] font-mono bg-rose-500/20 text-rose-300 rounded hover:bg-rose-500/30 cursor-pointer"
                          >
                            Clear File
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Skills Manager (Add, Edit, Delete) */}
          {activeTab === "skills" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Technical Skill Arsenal</h4>
                  <p className="text-xs text-neutral-400 font-mono">Add new skills, adjust proficiency meters, and curate categories</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSkill(!showAddSkill)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {showAddSkill ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{showAddSkill ? "Cancel" : "Add New Skill"}</span>
                </button>
              </div>

              {/* Add New Skill Form Card */}
              {showAddSkill && (
                <form onSubmit={handleAddNewSkill} className="p-5 rounded-2xl bg-[#0e1017] border border-cyan-500/40 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <h5 className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Configure New Skill</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Skill Name</label>
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g. PyTorch, Docker, Tableau, GCP"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Category</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Programming">Programming</option>
                        <option value="Development">Development</option>
                        <option value="Data Engineering / Cloud">Data Engineering / Cloud</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono">
                      <label className="text-neutral-300">Proficiency Rating</label>
                      <span className="text-cyan-400 font-bold">{newSkillProficiency}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={newSkillProficiency}
                      onChange={(e) => setNewSkillProficiency(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-300 font-mono">Technical Description / Use Case</label>
                    <textarea
                      rows={2}
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      placeholder="e.g. Deep learning model architectures, convolutional networks, and transfer learning pipelines."
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSkill(false)}
                      className="px-3 py-1.5 rounded-lg bg-[#111115] border border-white/[0.08] text-xs font-mono text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save & Add Skill</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Skills Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editSkills.map((skill, idx) => (
                  <div key={skill.name + idx} className="p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.08] space-y-3 relative group hover:border-white/[0.2] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const updated = [...editSkills];
                          updated[idx].name = e.target.value;
                          setEditSkills(updated);
                        }}
                        className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-white/[0.2] focus:border-cyan-500 focus:outline-none flex-1"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-xs">{skill.proficiency}%</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(idx)}
                          className="p-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title={`Delete ${skill.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={skill.proficiency}
                        onChange={(e) => {
                          const updated = [...editSkills];
                          updated[idx].proficiency = parseInt(e.target.value, 10);
                          setEditSkills(updated);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-[11px]">
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          const updated = [...editSkills];
                          updated[idx].category = e.target.value;
                          setEditSkills(updated);
                        }}
                        className="bg-[#050505] border border-white/[0.06] rounded p-1.5 text-neutral-400 text-[11px] font-mono"
                      >
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Programming">Programming</option>
                        <option value="Development">Development</option>
                        <option value="Data Engineering / Cloud">Data Engineering / Cloud</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      value={skill.description}
                      onChange={(e) => {
                        const updated = [...editSkills];
                        updated[idx].description = e.target.value;
                        setEditSkills(updated);
                      }}
                      className="w-full bg-[#050505] border border-white/[0.06] rounded-lg p-2 text-[11px] text-neutral-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Certifications & Credentials (Add, Edit, Delete) */}
          {activeTab === "certifications" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Verified Certifications & Credentials</h4>
                  <p className="text-xs text-neutral-400 font-mono">Manage credential IDs, issuers, and verification portals</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {showAddCert ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{showAddCert ? "Cancel" : "Add Certification"}</span>
                </button>
              </div>

              {/* Add New Certification Form Card */}
              {showAddCert && (
                <form onSubmit={handleAddNewCertification} className="p-5 rounded-2xl bg-[#0e1017] border border-cyan-500/40 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <h5 className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span>Add New Certification / Credential</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Certification Title</label>
                      <input
                        type="text"
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        placeholder="e.g. AWS Certified Machine Learning Specialty"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Issuer / Organization</label>
                      <input
                        type="text"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        placeholder="e.g. IBM, Google, DeepLearning.AI, Stanford"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Issue Date / Year</label>
                      <input
                        type="text"
                        value={newCertDate}
                        onChange={(e) => setNewCertDate(e.target.value)}
                        placeholder="e.g. 2025 or Dec 2024"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-mono">Credential ID</label>
                      <input
                        type="text"
                        value={newCertId}
                        onChange={(e) => setNewCertId(e.target.value)}
                        placeholder="e.g. IBM-DS-884920"
                        className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-300 font-mono">Verification URL (Credly / Coursera / Issuer Portal)</label>
                    <input
                      type="url"
                      value={newCertUrl}
                      onChange={(e) => setNewCertUrl(e.target.value)}
                      placeholder="https://www.credly.com/badges/your-id"
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-300 font-mono">Covered Competencies (comma separated)</label>
                    <input
                      type="text"
                      value={newCertSkills}
                      onChange={(e) => setNewCertSkills(e.target.value)}
                      placeholder="e.g. Python, Supervised Learning, XGBoost, Model Validation"
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCert(false)}
                      className="px-3 py-1.5 rounded-lg bg-[#111115] border border-white/[0.08] text-xs font-mono text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save & Add Certification</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Certifications List */}
              <div className="space-y-4">
                {editCertifications.map((cert, idx) => (
                  <div key={cert.id} className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...editCertifications];
                          updated[idx].title = e.target.value;
                          setEditCertifications(updated);
                        }}
                        className="text-sm font-bold text-white bg-transparent border-b border-white/[0.08] pb-1 w-full focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...editCertifications];
                            updated[idx].issuer = e.target.value;
                            setEditCertifications(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Issue Date</label>
                        <input
                          type="text"
                          value={cert.issueDate}
                          onChange={(e) => {
                            const updated = [...editCertifications];
                            updated[idx].issueDate = e.target.value;
                            setEditCertifications(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => {
                            const updated = [...editCertifications];
                            updated[idx].credentialId = e.target.value;
                            setEditCertifications(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Verification Link</label>
                        <input
                          type="url"
                          value={cert.verifyUrl}
                          onChange={(e) => {
                            const updated = [...editCertifications];
                            updated[idx].verifyUrl = e.target.value;
                            setEditCertifications(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Covered Competencies (comma separated)</label>
                        <input
                          type="text"
                          value={(cert.skills || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...editCertifications];
                            updated[idx].skills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                            setEditCertifications(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: Projects Manager */}
          {activeTab === "projects" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Projects Catalog</h4>
                  <p className="text-xs text-neutral-400 font-mono">Manage showcase cards, GitHub source links, metrics, and live demo links</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProj: Project = {
                      id: `proj-${Date.now()}`,
                      number: `0${editProjects.length + 1}`,
                      title: "New AI / Data Science Project",
                      category: "Machine Learning",
                      shortDesc: "Comprehensive end-to-end data science implementation with validated benchmark metrics.",
                      problem: "Manual and inefficient data processing workflows.",
                      solution: "Automated machine learning pipeline with real-time inference and metrics visualization.",
                      technologies: ["Python", "Machine Learning", "Pandas"],
                      features: ["High-accuracy predictions", "Automated feature engineering"],
                      metrics: [{ label: "Accuracy", value: "98.2%" }],
                      githubUrl: "https://github.com/kishoreDS23",
                      liveDemoUrl: "",
                    };
                    setEditProjects([newProj, ...editProjects]);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {editProjects.map((proj, idx) => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].title = e.target.value;
                          setEditProjects(updated);
                        }}
                        className="text-sm font-bold text-white bg-transparent border-b border-white/[0.08] pb-1 w-full focus:outline-none focus:border-cyan-500"
                        placeholder="Project Title"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditProjects(editProjects.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].category = e.target.value;
                            setEditProjects(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={(proj.technologies || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].technologies = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                            setEditProjects(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* GitHub Source Link & Live Demo URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-cyan-400 font-mono flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>GitHub Source Repository Link (Redirect Target)</span>
                        </label>
                        <input
                          type="url"
                          value={proj.githubUrl || ""}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].githubUrl = e.target.value;
                            setEditProjects(updated);
                          }}
                          placeholder="https://github.com/kishoreDS23/your-repo"
                          className="w-full bg-[#050505] border border-cyan-500/30 focus:border-cyan-400 rounded-lg p-2 text-cyan-300 font-mono text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-mono flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo URL (Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={proj.liveDemoUrl || ""}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].liveDemoUrl = e.target.value;
                            setEditProjects(updated);
                          }}
                          placeholder="https://... or #playground"
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-400 font-mono">Short Description</label>
                      <textarea
                        rows={2}
                        value={proj.shortDesc}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].shortDesc = e.target.value;
                          setEditProjects(updated);
                        }}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-red-400 font-mono">Problem Statement</label>
                        <textarea
                          rows={2}
                          value={proj.problem || ""}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].problem = e.target.value;
                            setEditProjects(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-emerald-400 font-mono">Solution Description</label>
                        <textarea
                          rows={2}
                          value={proj.solution || ""}
                          onChange={(e) => {
                            const updated = [...editProjects];
                            updated[idx].solution = e.target.value;
                            setEditProjects(updated);
                          }}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: Academic Details */}
          {activeTab === "education" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <span>Academic Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Degree Title</label>
                    <input
                      type="text"
                      value={editEducation.degree}
                      onChange={(e) => setEditEducation({ ...editEducation, degree: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Institution / College</label>
                    <input
                      type="text"
                      value={editEducation.institution}
                      onChange={(e) => setEditEducation({ ...editEducation, institution: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Duration</label>
                    <input
                      type="text"
                      value={editEducation.duration}
                      onChange={(e) => setEditEducation({ ...editEducation, duration: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono">Specialization</label>
                    <input
                      type="text"
                      value={editEducation.specialization}
                      onChange={(e) => setEditEducation({ ...editEducation, specialization: e.target.value })}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-emerald-400 font-mono font-semibold">CGPA / Grade</label>
                    <input
                      type="text"
                      value={editEducation.cgpa || "8.52 / 10 CGPA"}
                      onChange={(e) => setEditEducation({ ...editEducation, cgpa: e.target.value })}
                      placeholder="8.52 / 10 CGPA"
                      className="w-full bg-[#050505] border border-emerald-500/30 rounded-lg p-2 text-emerald-300 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 bg-[#0a0a0d] border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            {isOwner && (
              <button
                onClick={resetToDefaults}
                className="px-3 py-1.5 rounded-lg bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-300 text-xs font-mono cursor-pointer"
            >
              Close
            </button>

            {isOwner && (
              <button
                onClick={handleSaveAll}
                id="btn-save-all-owner-portal"
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Deploy Live</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

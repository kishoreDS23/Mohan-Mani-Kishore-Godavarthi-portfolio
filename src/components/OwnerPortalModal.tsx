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
    const cleanPass = passwordInput.trim();
    const cleanA1 = loginA1.trim().toLowerCase();
    const cleanA2 = loginA2.trim().toLowerCase();

    if (!cleanPass) {
      setStatusMessage({ type: "error", text: "Please enter your master password." });
      return;
    }
    if (!cleanA1 || !cleanA2) {
      setStatusMessage({ type: "error", text: "Please answer both security questions for identity verification." });
      return;
    }

    setIsSubmittingAuth(true);
    setStatusMessage(null);

    try {
      const res = await loginOwner(cleanPass, cleanA1, cleanA2);
      
      // Allow API success or fallback matching for kishore@2007, ml, and r
      const isDirectMatch = 
        (cleanPass === "kishore@2007") && 
        (cleanA1 === "ml" || cleanA1 === "machine learning") && 
        (cleanA2 === "r" || cleanA2 === "python");

      if (res?.success || isDirectMatch) {
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
          text: res?.error || "Incorrect credentials. Please verify your master password and security answers.",
        });
      }
    } catch (err: any) {
      // Fallback check
      if (
        cleanPass === "kishore@2007" && 
        (cleanA1 === "ml" || cleanA1 === "machine learning") && 
        (cleanA2 === "r" || cleanA2 === "python")
      ) {
        setStatusMessage({
          type: "success",
          text: "Identity verified! Owner Studio unlocked.",
        });
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setPasswordInput("");
        setLoginA1("");
        setLoginA2("");
        setTimeout(() => setActiveTab(initialTab || "profile"), 400);
      } else {
        setStatusMessage({ type: "error", text: "Incorrect password or security answers. Please verify your credentials." });
      }
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

  const handleDeleteSkill = (index: number) => {
    const target = editSkills[index];
    const updated = editSkills.filter((_, i) => i !== index);
    setEditSkills(updated);
    setStatusMessage({ type: "info", text: `Removed "${target.name}" from skills.` });
  };

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

  const handleDeleteCert = (id: string) => {
    const updated = editCertifications.filter(c => c.id !== id);
    setEditCertifications(updated);
    setStatusMessage({ type: "info", text: "Certification credential deleted." });
  };

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
          
          {/* TAB 0: Authentication Gate */}
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
                      placeholder="e.g. ml"
                      className="w-full bg-[#050505] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 font-mono">
                      2. What is your primary language / handle?
                    </label>
                    <input
                      type="text"
                      value={loginA2}
                      onChange={(e) => setLoginA2(e.target.value)}
                      placeholder="e.g. r"
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

          {/* TAB 2: Complete Resume Editor */}
          {activeTab === "resume" && isOwner && (
            <div className="space-y-6 max-w-4xl mx-auto">
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

              {/* SECTION 1: Personal Header */}
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
                </div>
              )}

              {/* SECTION 2: Career Objective */}
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

              {/* SECTION 3: Education */}
              {(resumeSubSection === "all" || resumeSubSection === "education") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Education & Academic Background</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Degrees & Scores</span>
                  </h4>

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
                  </div>
                </div>
              )}

              {/* SECTION 4: Experience */}
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6: Achievements */}
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

              {/* SECTION 7: Coding Profiles */}
              {(resumeSubSection === "all" || resumeSubSection === "coding") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Coding & Competitive Profiles</span>
                    </h4>
                  </div>

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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 8: Document PDF File */}
              {(resumeSubSection === "all" || resumeSubSection === "document") && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-4">
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Resume File & External Downloads</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">File Storage</span>
                  </h4>

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
                      <p className="text-white font-medium">Upload New Resume PDF</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/[0.15] cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Choose File</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Skills Manager */}
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
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Certifications */}
          {activeTab === "certifications" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Verified Certifications & Credentials</h4>
                </div>
              </div>

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
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Projects */}
          {activeTab === "projects" && isOwner && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Projects Catalog</h4>
                </div>
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
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditProjects(editProjects.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
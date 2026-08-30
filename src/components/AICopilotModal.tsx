import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  Code2, 
  Brain,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { ChatMessage } from "../types";
import { usePortfolio } from "../context/PortfolioContext";

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const { profile } = usePortfolio();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "gemini",
      text: "Hello! I am Mani Kishore's AI Career & Technical Assistant. I can answer questions about Mani Kishore Godavarthi's Data Science coursework at Pragati Engineering College, his Automated Data Cleaning pipeline, ML models, or technical interview preparedness. How can I help you?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        "Why hire Mani Kishore for an ML / Data Science role?",
        "Explain the Automated Data Cleaning project in depth.",
        "What is Mani Kishore's experience with YOLO & Computer Vision?",
        "Generate a technical interview question for Mani Kishore.",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Mani Kishore Godavarthi is a skilled Data Science student at Pragati Engineering College with deep expertise in Python, machine learning, and automated data pipelines.";

      const geminiMsg: ChatMessage = {
        id: `gemini-${Date.now()}`,
        sender: "gemini",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          "How does Mani Kishore handle statistical outliers via IQR?",
          "What databases and BI tools does Mani Kishore know?",
          "How can I contact Mani Kishore directly?",
        ],
      };

      setMessages((prev) => [...prev, geminiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "gemini",
          text: `Mani Kishore specializes in Python, Machine Learning, automated data pipelines, and Power BI. He is graduating from Pragati Engineering College in 2027 and is actively available for data science roles. You can contact him at ${profile.social.email}!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/[0.1] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0a0a0d] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <span>{profile.fullName}'s AI Copilot</span>
                <span className="px-2 py-0.5 rounded-full bg-[#111115] text-cyan-400 text-[10px] font-mono border border-white/[0.08]">
                  Gemini 3.7
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Ask anything about technical skills, projects, or hireability
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#111115] border border-white/[0.08] text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "gemini" && (
                <div className="w-7 h-7 rounded-lg bg-[#0e161c] border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                  msg.sender === "user"
                    ? "bg-white text-black font-medium rounded-tr-sm"
                    : "bg-[#0a0a0d] border border-white/[0.08] text-neutral-200 rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] opacity-60 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "gemini" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:opacity-100 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Suggested Followups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                      Quick Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-2.5 py-1 rounded-lg bg-[#111115] hover:bg-[#18181d] text-neutral-300 text-[11px] font-mono border border-white/[0.08] hover:border-white/[0.2] text-left transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-lg bg-[#111115] border border-white/[0.08] flex items-center justify-center shrink-0 text-neutral-200">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0e161c] border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] text-xs font-mono text-cyan-300 flex items-center gap-2">
                <span>Analyzing Mani Kishore's technical portfolio and knowledge base...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0a0a0d] border-t border-white/[0.08]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a technical or career question about Mani Kishore..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

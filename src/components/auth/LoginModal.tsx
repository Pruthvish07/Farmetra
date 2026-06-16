import React, { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { Globe, Shield, User, Loader2, Leaf, CheckCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithUsername } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  // Local UI states
  const [usernameInput, setUsernameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<'Farmer' | 'Expert'>('Farmer');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInstantSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setError("Please choose a valid farmer username.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithUsername(usernameInput.trim(), language, selectedRole);
      onClose(); // Close the modal upon success
    } catch (err: any) {
      setError(err.message || "Failed to establish secure session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#080B09]/80 backdrop-blur-md"
      />

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-[#111613] w-full max-w-md rounded-[36px] p-8 border border-white/[0.08] shadow-2xl relative z-10 text-left space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#1B4332] items-center justify-center border border-emerald-500/20 shadow-md">
            <Leaf className="text-[#83f369] w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
              FARMETRA SIGN-IN
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Set display identity
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs p-4 rounded-2xl">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleInstantSignIn} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <User size={12} className="text-emerald-500" />
              Pick Your Username
            </label>
            <input
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. Ramesh Patil"
              maxLength={30}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-xs font-bold p-4 rounded-2xl outline-none focus:border-emerald-500/40 text-left text-white"
            />
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Globe size={12} className="text-emerald-500" />
              Preferred Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: "en", name: "English" },
                { code: "hi", name: "हिन्दी" },
                { code: "kn", name: "ಕನ್ನಡ" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "py-2.5 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                    language === lang.code
                      ? "bg-emerald-600 text-white shadow-md font-black"
                      : "bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 border border-transparent"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Identity Role */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-500" />
              Identity Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "Farmer", label: "Community Farmer" },
                { role: "Expert", label: "Expert Advisor" }
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role as any)}
                  className={cn(
                    "py-2.5 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                    selectedRole === item.role
                      ? "bg-emerald-600 text-white shadow-md font-black border border-emerald-500/30"
                      : "bg-white/[0.02] hover:bg-white/[0.06] text-slate-400"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 text-[#83f369] hover:text-white bg-emerald-550/10 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCircle size={13} />
            )}
            Initialize Agri-Intel Node
          </button>
        </form>
      </motion.div>
    </div>
  );
}

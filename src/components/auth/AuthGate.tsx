import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { Globe, Shield, User, Loader2, Leaf, Lock, CheckCircle, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, loginWithRedirect, loginWithUsername, updateProfileData } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  // Local UI states
  const [usernameInput, setUsernameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<'Farmer' | 'Expert'>('Farmer');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile setup states (for Google Auth users who need to claim/confirm username)
  const [confirmName, setConfirmName] = useState("");
  const [setupRole, setSetupRole] = useState<'Farmer' | 'Expert'>('Farmer');
  const [confirmStepRunning, setConfirmStepRunning] = useState(false);

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
    } catch (err: any) {
      setError(err.message || "Failed to establish secure session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const desiredName = confirmName.trim() || user?.displayName || user?.email?.split("@")[0] || "";
    if (!desiredName) {
      setError("Please provide a valid username.");
      return;
    }
    setError(null);
    setConfirmStepRunning(true);
    try {
      await updateProfileData(desiredName, language, setupRole);
    } catch (err: any) {
      setError(err.message || "Could not synchronize profile data.");
    } finally {
      setConfirmStepRunning(false);
    }
  };

  // 1. Loading active synchronization
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#080B09] flex flex-col items-center justify-center text-white font-sans">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-6" />
          <p className="text-sm font-bold tracking-widest text-[#83f369] uppercase animate-pulse">
            SECURE SYNC ACTIVE...
          </p>
        </div>
      </div>
    );
  }

  // 2. Not Signed In (Compulsory Sign In Gate!)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#080B09] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
        
        {/* Subtle atmospheric light orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-950/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          
          {/* Logo & Headline */}
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-900 items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-400/20">
              <Leaf className="text-[#83f369] w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center justify-center gap-2">
                FARMETRA <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">V5.0</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                Agri-Intel Pathology Node
              </p>
            </div>
          </div>

          {/* Unified login card */}
          <div className="bg-[#111613] rounded-[36px] p-8 border border-white/[0.05] shadow-2xl relative space-y-6">
            
            <div className="flex items-center gap-2 text-emerald-400">
              <Lock size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Compulsory Node Verification</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs p-4 rounded-2xl flex items-center gap-3">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Method 1: Google login */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  setError(null);
                  try {
                    await loginWithRedirect();
                  } catch (e: any) {
                    setError(e.message || "Google Redirect restricted. Use Sandbox Quick-Access fallback below.");
                  }
                }}
                className="w-full py-4 px-6 bg-white text-[#080B09] hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.284.614 4.512 1.637l2.435-2.435C17.422 1.586 14.934 1 12.24 1 6.16 1 1.24 5.922 1.24 12c0 6.078 4.92 11 11 11 6.338 0 11.24-4.463 11.24-11 0-.715-.078-1.29-.215-1.715H12.24z"/>
                </svg>
                {t("signInWithGoogle")}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.04]"></div>
              <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-black tracking-widest uppercase">
                OR QUICKFALLBACK
              </span>
              <div className="flex-grow border-t border-white/[0.04]"></div>
            </div>

            {/* Method 2: Instant Username Choice (SOLVES picking username and broken sign-ins!) */}
            <form onSubmit={handleInstantSignIn} className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <User size={12} className="text-emerald-500" />
                  Pick Your Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. Farmer Ramesh"
                  maxLength={30}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-xs font-bold p-4 rounded-2xl outline-none focus:border-emerald-500/40 text-left text-white"
                />
              </div>

              {/* Toggle-grid for language right in login! */}
              <div className="space-y-2 text-left">
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
                        "py-3 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
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

              {/* Multi-role picker */}
              <div className="space-y-2 text-left">
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
                        "py-3 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-[#83f369] hover:text-white bg-emerald-550/10 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle size={13} />
                )}
                Initialize Agri-Intel Node
              </button>
            </form>
          </div>

          <div className="text-center">
            <span className="text-[9px] text-[#8E9299] font-bold uppercase tracking-widest leading-loose flex items-center justify-center gap-1.5 bg-white/[0.01] px-4 py-2 rounded-xl border border-white/[0.02] mx-auto w-fit">
              <Smartphone size={10} className="text-emerald-500" />
              Offline certified database buffer enabled
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. User Signed In, but profile metadata is incomplete or user has empty username (SOLVES: "let user pick username!")
  const needsUsernamePick = !profile || !profile.displayName || profile.displayName.trim() === "" || profile.displayName === "Farmer Participant";
  
  if (needsUsernamePick) {
    return (
      <div className="min-h-screen bg-[#080B09] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
        
        {/* Subtle atmospheric glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-950/20 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-emerald-900/50 items-center justify-center border border-emerald-500/20 shadow-lg">
              <User className="text-[#83f369] w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                Claim Your Username
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-normal">
                Choose a unique profile identity for the community index
              </p>
            </div>
          </div>

          <div className="bg-[#111613] rounded-[36px] p-8 border border-white/[0.05] shadow-2xl relative space-y-6">

            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs p-4 rounded-2xl">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleConfirmProfile} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Farmer Display Username
                </label>
                <input
                  type="text"
                  required
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder="e.g. Ramesh Patil Agritech"
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-xs font-bold p-4 rounded-2xl outline-none focus:border-emerald-500/40 text-left text-white"
                />
              </div>

              {/* Language Picker */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Preferred Regional Tongue
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
                        "py-3 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                        language === lang.code
                          ? "bg-emerald-600 text-white shadow-md font-black"
                          : "bg-white/[0.02] hover:bg-white/[0.06] text-slate-400"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Segmented Identity Role */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Role Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: "Farmer", label: "Community Farmer" },
                    { role: "Expert", label: "Expert Consultant" }
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSetupRole(item.role as any)}
                      className={cn(
                        "py-3 rounded-xl font-bold text-[#83f369] text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                        setupRole === item.role
                          ? "bg-emerald-600/35 text-white border border-emerald-500/20"
                          : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={confirmStepRunning}
                className="w-full py-4 text-[#080B09] bg-[#83f369] hover:bg-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {confirmStepRunning ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle size={13} />
                )}
                Confirm Username & Activate Node
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated & fully customized profile -> Unlock full web application safely!
  return <>{children}</>;
}

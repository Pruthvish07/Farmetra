import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CameraScreen from './components/camera/CameraScreen';
import DiagnosisResult from './components/diagnosis/DiagnosisResult';
import CropGuide from './components/guide/CropGuide';
import SplashScreen from './components/layout/SplashScreen';
import CommunityFeedback from './components/feedback/CommunityFeedback';
import { Diagnosis } from './types';
import { Settings, User, Globe, Shield, Sun, Moon, Calendar, FileText, ChevronRight } from 'lucide-react';
import { USER_NAME } from './constants';
import { cn } from './lib/utils';
import { useAuth } from './lib/AuthContext';
import { useLanguage } from './lib/LanguageContext';
import AuthGate from './components/auth/AuthGate';

// Seed sample diagnosis histories to prevent empty states on first run, matching mockup details!
const sampleDetections: Diagnosis[] = [
  {
    id: "sample-tomato-eb",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600",
    cropName: "Tomato",
    diseaseName: "Early Blight",
    diseaseType: "Fungal",
    confidence: 0.94,
    severity: "Medium",
    symptoms: [
      "Concentric circular black spots resembling target marks",
      "Lower leaves yellowing and dropping off prematurely",
      "Leathery dark lesions appearing near the stem base"
    ],
    treatment: [
      "Manually pinch off defoliated lower leaves to halt splash contamination",
      "Apply copper sulfate or chlorothalonil fungicide spray on a 7-day loop",
      "Spread fresh straw mulch to lock soil spores safely down"
    ],
    preventiveMeasures: [
      "Adhere to a strict 3-year Solanaceae crop rotation cycle",
      "Transition from overhead sprinklers to single base-drip irrigation"
    ]
  },
  {
    id: "sample-potato-lb",
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
    cropName: "Potato",
    diseaseName: "Late Blight",
    diseaseType: "Fungal",
    confidence: 0.89,
    severity: "High",
    symptoms: [
      "Large water-soaked dark lesions spreading rapidly across mature foliage",
      "Fine white mildew growth surfacing on under-leaf margins during misty conditions",
      "Spud tubers turning dark brown, dry and rotting inside"
    ],
    treatment: [
      "Prune all affected stems immediately and bag/bury away from active fields",
      "Foliar spray potassium phosphite or systemic metalaxyl remedies",
      "Dry fields by delaying early morning irrigation cycles"
    ],
    preventiveMeasures: [
      "Plant strictly certified disease-resistant seed potato tubers",
      "Ensure proper row-hilling to form a dense soil barrier over tubers"
    ]
  }
];

export default function App() {
  const { user, profile, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCamera, setShowCamera] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<Diagnosis[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Persist dark mode settings to localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Synchronize Firestore profile selected language to the active Language Context
  useEffect(() => {
    if (profile?.language) {
      setLanguage(profile.language);
    }
  }, [profile]);

  // Local storage persistence combined with seed defaults
  useEffect(() => {
    const saved = localStorage.getItem('diagnosis_history');
    if (saved) {
      setDiagnosisHistory(JSON.parse(saved));
    } else {
      // Seed initial mockups data so the app looks magnificent on startup
      setDiagnosisHistory(sampleDetections);
      localStorage.setItem('diagnosis_history', JSON.stringify(sampleDetections));
    }
  }, []);

  // Load real diagnostics from Firestore when securely authenticated
  useEffect(() => {
    if (!user || user.uid.startsWith("offline_user_")) return;

    const loadFirestoreDiagnostics = async () => {
      try {
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const { db } = await import("./lib/firebase");
        
        const q = query(
          collection(db, "diagnostics"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const firestoreList: Diagnosis[] = [];
        querySnapshot.forEach((doc) => {
          firestoreList.push(doc.data() as Diagnosis);
        });
        
        if (firestoreList.length > 0) {
          // Sort descending by timestamp
          firestoreList.sort((a, b) => b.timestamp - a.timestamp);
          setDiagnosisHistory(firestoreList);
          localStorage.setItem('diagnosis_history', JSON.stringify(firestoreList));
        }
      } catch (err) {
        console.error("Could not fetch remote diagnostics history:", err);
      }
    };

    loadFirestoreDiagnostics();
  }, [user]);

  const handleDiagnosisComplete = async (diagnosis: Diagnosis) => {
    setShowCamera(false);
    setCurrentDiagnosis(diagnosis);
    const updatedHistory = [diagnosis, ...diagnosisHistory];
    setDiagnosisHistory(updatedHistory);
    localStorage.setItem('diagnosis_history', JSON.stringify(updatedHistory));

    // Save to Firestore if real session is active
    if (user && !user.uid.startsWith("offline_user_")) {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("./lib/firebase");
        const diagnosisDocRef = doc(db, "diagnostics", diagnosis.id);
        const payload = {
          ...diagnosis,
          userId: user.uid,
        };
        await setDoc(diagnosisDocRef, payload);
        console.log("Diagnosis synchronized with Firestore.");
      } catch (err) {
        console.error("Failed to sync diagnosis to Firestore:", err);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            recentReports={diagnosisHistory.slice(0, 3)} 
            onViewReport={setCurrentDiagnosis} 
            onLaunchCamera={() => setShowCamera(true)}
            historyCount={diagnosisHistory.length}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'guide':
        return <CropGuide />;
      case 'forum':
        return (
          <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
            <CommunityFeedback />
          </div>
        );
      case 'history':
        return (
          <div className="p-6 pb-24 max-w-4xl mx-auto space-y-6">
            <div className="space-y-1 text-left">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[#1B4332] dark:text-white flex items-center gap-2">
                <FileText size={24} className="text-emerald-600" /> {t('history')}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Review and inspect all previous neural analysis reports captured on-site
              </p>
            </div>

            <div className="space-y-4">
              {diagnosisHistory.length > 0 ? (
                diagnosisHistory.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setCurrentDiagnosis(report)}
                    className="w-full bg-white dark:bg-white/5 p-4 rounded-3xl border border-[#E5E5E5] dark:border-white/10 flex items-center gap-4 hover:border-emerald-500/40 active:scale-98 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-emerald-100 dark:border-white/15 bg-slate-150">
                      <img src={report.imageUrl} alt={report.cropName} className="w-full h-full object-cover group-hover:scale-105 duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-[#1B4332] dark:text-white uppercase tracking-tight truncate">
                        {report.cropName} - {report.diseaseName}
                      </h4>
                      <p className="text-[10px] font-bold text-[#8E9299] uppercase tracking-wider mt-1 flex items-center gap-1">
                        <Calendar size={11} /> {new Date(report.timestamp).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-2 inline-block border",
                        report.severity === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                        report.severity === 'Medium' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {report.severity} Severity
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-[#8E9299]/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                  </button>
                ))
              ) : (
                <div className="py-24 text-center bg-white dark:bg-white/5 rounded-3xl border border-[#E5E5E5]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-normal">
                    {t('noDetections')}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        const avatarName = user ? (user.displayName || user.email || "Farmer") : USER_NAME;
        const initials = avatarName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        return (
          <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-8 pb-24 relative z-10 transition-colors text-left">
            <div className="bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-sm border border-emerald-50 dark:border-white/10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-3xl font-black mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/20 shadow-xl overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  initials
                )}
              </div>
              <h2 className="text-2xl font-black text-[#1B4332] dark:text-white tracking-tighter uppercase">
                {user ? (user.displayName || "Farmer Participant") : USER_NAME}
              </h2>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                {profile?.role === "Admin" ? "System Administrator" : profile?.role === "Expert" ? "Expert Consultant" : "Community Farmer Member"}
              </p>
              
              {user && (
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-400">{user.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 px-6">{t('adminAccessControl')}</h3>
              <div className="bg-white dark:bg-white/5 rounded-[32px] overflow-hidden border border-emerald-50 dark:border-white/10 shadow-sm">
                <ProfileItem icon={Shield} label={t('adminDashboard')} value={t('secured')} highlight />
                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                
                {/* Real-time Language Trigger Selector */}
                <div className="p-6 space-y-3 bg-slate-50/[0.05]">
                  <div className="flex items-center gap-4 text-xs font-black text-[#1B4332] dark:text-white uppercase tracking-widest">
                    <Globe size={18} className="text-emerald-600" />
                    <span>{t('languageSelect')}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'hi', name: 'हिन्दी (Hi)' },
                      { code: 'kn', name: 'ಕನ್ನಡ (Kn)' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={async () => {
                          setLanguage(lang.code);
                          if (user) {
                            const { doc, updateDoc } = await import("firebase/firestore");
                            const { db } = await import("./lib/firebase");
                            const userDocRef = doc(db, "users", user.uid);
                            await updateDoc(userDocRef, { language: lang.code });
                          }
                        }}
                        className={cn(
                          "px-3 py-3 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                          language === lang.code
                            ? "bg-[#1B4332] text-white shadow-md font-extrabold"
                            : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                <ProfileItem icon={Settings} label={t('engineConfig')} value={t('v4optimized')} />
                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                <ProfileItem 
                  icon={isDarkMode ? Sun : Moon} 
                  label={isDarkMode ? "Light Theme" : "Dark Theme"} 
                  value={isDarkMode ? "Active Light" : "Active Dark"}
                  onClick={toggleTheme}
                />
              </div>
            </div>

            <div className="bg-emerald-950 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="relative z-10 text-left">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#83f369] mb-2">Cloud Connectivity Mode</h4>
                    <p className="text-xs opacity-70 leading-relaxed font-medium italic">
                        Farmetra active buffer is dynamically persisted to Google Cloud Firestore. Feedbacks, custom comments, and like metrics are fully secured and synchronized globally.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-900 rounded-full opacity-30" />
            </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            recentReports={diagnosisHistory.slice(0, 3)} 
            onViewReport={setCurrentDiagnosis} 
            onLaunchCamera={() => setShowCamera(true)}
            historyCount={diagnosisHistory.length}
            onNavigateToTab={setActiveTab}
          />
        );
    }
  };

  // Render original Splash Screen initially to recreate mockup 1!
  if (!isLoaded) {
    return <SplashScreen onFinish={() => setIsLoaded(true)} />;
  }

  return (
    <AuthGate>
      <Layout 
        activeTab={showCamera ? 'camera' : activeTab} 
        onTabChange={(tab) => {
          if (tab === 'camera') {
            setShowCamera(true);
          } else {
            setActiveTab(tab);
            setShowCamera(false);
            setCurrentDiagnosis(null);
          }
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      >
        {renderContent()}
        
        {showCamera && (
          <CameraScreen 
            onDiagnosisComplete={handleDiagnosisComplete} 
            onCancel={() => {
              setShowCamera(false);
              setActiveTab('dashboard');
            }} 
          />
        )}

        {currentDiagnosis && (
          <DiagnosisResult 
            diagnosis={currentDiagnosis} 
            onClose={() => {
              setCurrentDiagnosis(null);
              setActiveTab('dashboard');
            }} 
          />
        )}
      </Layout>
    </AuthGate>
  );
}

function ProfileItem({ icon: Icon, label, value, highlight, onClick }: { icon: any, label: string, value?: string, highlight?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 hover:bg-emerald-50/30 dark:hover:bg-white/5 active:bg-emerald-50 dark:active:bg-white/10 transition-all group"
    >
      <div className="flex items-center gap-4 text-left">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all",
          highlight ? "bg-[#1B4332] text-white" : "bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-emerald-600"
        )}>
          <Icon size={18} />
        </div>
        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</span>
      </div>
      {value && <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border", highlight ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-transparent")}>{value}</span>}
    </button>
  );
}

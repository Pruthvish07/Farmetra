import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CameraScreen from './components/camera/CameraScreen';
import DiagnosisResult from './components/diagnosis/DiagnosisResult';
import Gallery from './components/gallery/Gallery';
import { Diagnosis } from './types';
import { Settings, User, Globe, Shield, LogOut, Sun, Moon } from 'lucide-react';
import { USER_NAME } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCamera, setShowCamera] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<Diagnosis[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('diagnosis_history');
    if (saved) {
      setDiagnosisHistory(JSON.parse(saved));
    }
  }, []);

  const handleDiagnosisComplete = (diagnosis: Diagnosis) => {
    setShowCamera(false);
    setCurrentDiagnosis(diagnosis);
    const updatedHistory = [diagnosis, ...diagnosisHistory];
    setDiagnosisHistory(updatedHistory);
    localStorage.setItem('diagnosis_history', JSON.stringify(updatedHistory));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          recentReports={diagnosisHistory.slice(0, 3)} 
          onViewReport={setCurrentDiagnosis} 
          onLaunchCamera={() => setShowCamera(true)}
          historyCount={diagnosisHistory.length}
        />;
      case 'gallery':
        return <Gallery />;
      case 'history':
        return (
          <div className="p-6 pb-24">
            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">Pathogen Registry</h2>
            <div className="space-y-4">
              {diagnosisHistory.length > 0 ? (
                diagnosisHistory.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setCurrentDiagnosis(report)}
                    className="w-full bg-white p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4 active:scale-95 transition-transform"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={report.imageUrl} alt={report.cropName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-sm">{report.cropName}</h4>
                      <p className="text-xs text-[#9E9E9E]">{report.diseaseName}</p>
                      <p className="text-[10px] text-[#9E9E9E] mt-1">{new Date(report.timestamp).toLocaleString()}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-[#9E9E9E] py-20 text-sm">No analysis reports available.</p>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-8 pb-24 relative z-10 transition-colors">
            <div className="bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-sm border border-emerald-50 dark:border-white/10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-black mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/20 shadow-xl">
                {USER_NAME.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <h2 className="text-2xl font-black text-emerald-900 dark:text-white tracking-tighter uppercase">{USER_NAME}</h2>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">System Administrator</p>
              <div className="mt-6 flex gap-3">
                 <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100 dark:border-emerald-500/20">LEVEL 4 CLEARANCE</span>
                 <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black border border-blue-100 dark:border-blue-500/20">REGIONAL HEAD</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 px-6">System Access Control</h3>
              <div className="bg-white dark:bg-white/5 rounded-[32px] overflow-hidden border border-emerald-50 dark:border-white/10 shadow-sm">
                <ProfileItem icon={Shield} label="Admin Dashboard" value="Secured" highlight />
                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                <ProfileItem icon={Globe} label="Regional Language" value="Multi-Language (EN/HI/KN)" />
                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                <ProfileItem icon={Settings} label="CNN Engine Config" value="v4.2 Optimized" />
                <div className="h-px bg-slate-50 dark:bg-emerald-900/10 mx-6" />
                <ProfileItem 
                  icon={isDarkMode ? Sun : Moon} 
                  label={isDarkMode ? "Light Theme" : "Dark Theme"} 
                  value={isDarkMode ? "Switching to Light" : "Switching to Dark"}
                  onClick={toggleTheme}
                />
              </div>
            </div>

            <div className="bg-emerald-950 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Cloud Connectivity Mode</h4>
                    <p className="text-xs opacity-70 leading-relaxed font-medium italic">
                        Farmetra active buffer is currently in high-performance offline mode. Pathogen signatures are being cached locally for intermittent sync.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-900 rounded-full opacity-30" />
            </div>
          </div>
        );
      default:
        return <Dashboard 
          recentReports={diagnosisHistory.slice(0, 3)} 
          onViewReport={setCurrentDiagnosis} 
          onLaunchCamera={() => setShowCamera(true)}
          historyCount={diagnosisHistory.length}
        />;
    }
  };

  return (
    <Layout 
      activeTab={showCamera ? 'camera' : activeTab} 
      onTabChange={(tab) => tab === 'camera' ? setShowCamera(true) : setActiveTab(tab)}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
    >
      {renderContent()}
      
      {showCamera && (
        <CameraScreen 
          onDiagnosisComplete={handleDiagnosisComplete} 
          onCancel={() => setShowCamera(false)} 
        />
      )}

      {currentDiagnosis && (
        <DiagnosisResult 
          diagnosis={currentDiagnosis} 
          onClose={() => setCurrentDiagnosis(null)} 
        />
      )}
    </Layout>
  );
}

function ProfileItem({ icon: Icon, label, value, highlight, onClick }: { icon: any, label: string, value?: string, highlight?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 hover:bg-emerald-50/30 dark:hover:bg-white/5 active:bg-emerald-50 dark:active:bg-white/10 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all",
          highlight ? "bg-emerald-600 text-white" : "bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-emerald-600"
        )}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</span>
      </div>
      {value && <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg", highlight ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400")}>{value}</span>}
    </button>
  );
}

import { cn } from './lib/utils';

import { motion } from 'motion/react';
import { Home, Camera, History, User, Settings, Book, Sun, Moon, MessageSquare, Download } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { USER_NAME } from '../../constants';
import { cn } from '../../lib/utils';
import logoImg from '../../assets/images/farmetra_logo_1780246757391.png';
import { useLanguage } from '../../lib/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Layout({ children, activeTab, onTabChange, isDarkMode, onToggleTheme }: LayoutProps) {
  const { t } = useLanguage();

  // PWA installation state management
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  useEffect(() => {
    // Detect if app is already running in installed standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone) {
      // Always show button in standard web browser access to maximize conversion
      setShowInstallBtn(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent browser default installation prompt
      e.preventDefault();
      // Store the event for user-triggered launch
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      console.log('Farmetra has been successfully installed on this device.');
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions for browsers that don't support beforeinstallprompt natively (e.g. iOS Safari)
      alert(
        "To install Farmetra on your device:\n\n" +
        "• On iOS (Safari): Tap the Share button in the browser menu and select 'Add to Home Screen'.\n" +
        "• On Android (Chrome): Tap the menu icon (⋮) and select 'Install app' or 'Add to Home screen'.\n" +
        "• On Desktop (Chrome/Edge): Click the install icon in the address bar."
      );
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Installation Prompt Choice: ${outcome}`);
    } catch (err) {
      console.error("Installation failed:", err);
    } finally {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  // Mobile/Desktop navigation paths matching Mockup 2
  const sidebarTabs = [
    { id: 'dashboard', icon: Home, label: t('home') },
    { id: 'guide', icon: Book, label: t('guide') },
    { id: 'history', icon: History, label: t('history') },
    { id: 'forum', icon: MessageSquare, label: t('communityFeedback') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className={cn(
      "flex h-screen font-sans overflow-hidden transition-colors duration-500",
      isDarkMode ? "bg-[#0A0F0D] text-[#E0E7E1] dark" : "bg-[#F4F9F4] text-[#1B4332]"
    )}>
      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className={cn(
            "absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15",
            isDarkMode ? "bg-emerald-900" : "bg-emerald-200"
          )}
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className={cn(
            "absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15",
            isDarkMode ? "bg-blue-950" : "bg-blue-200"
          )}
        />
      </div>

      {/* 1. Desktop Left Sidebar */}
      <aside className={cn(
        "hidden md:flex w-72 border-r flex-col shrink-0 z-20 transition-colors",
        isDarkMode ? "bg-[#111814] border-emerald-900/30" : "bg-white border-emerald-100/60"
      )}>
        {/* App Logo and Title banner */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-200/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
            <img 
              src={logoImg} 
              alt="Farmetra Logo" 
              className="absolute inset-0 w-full h-full object-cover block" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className={cn(
              "text-2xl font-black tracking-tight leading-none",
              isDarkMode ? "text-white" : "text-[#1B4332]"
            )}>Farmetra</h1>
            <span className="text-[9px] text-[#8E9299] font-black uppercase tracking-widest block pt-1">
              {t('detectProtectGrow')}
            </span>
          </div>
        </div>
        
        {/* Navigation lists */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all mb-1.5",
                  isSelected 
                    ? (isDarkMode ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20 shadow-lg" : "bg-[#1B4332] text-white shadow-xl shadow-emerald-950/15") 
                    : (isDarkMode ? "text-[#8E9299] hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-[#1B4332]")
                )}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Theme switcher */}
          <div className={cn("pt-6 mt-6 border-t", isDarkMode ? "border-emerald-900/30" : "border-slate-100")}>
            <button
              onClick={onToggleTheme}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all",
                isDarkMode ? "text-amber-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>

        {/* Desktop profile status widget */}
        <div className="p-6">
          <div className={cn(
            "rounded-[24px] p-4 text-white shadow-lg transition-colors border",
            isDarkMode ? "bg-emerald-950/40 border-emerald-900/30" : "bg-[#1B4332] border-transparent"
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center text-emerald-900 font-extrabold text-[10px] uppercase">
                {USER_NAME.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <p className="text-xs font-black truncate text-white uppercase tracking-tight">{USER_NAME}</p>
            </div>
            <span className="text-[8px] text-emerald-300 font-black uppercase tracking-widest block pt-0.5 opacity-75">
              Secure System Admin
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header bar */}
        <header className={cn(
          "h-20 border-b px-6 md:px-8 flex items-center justify-between shrink-0 transition-colors z-20",
          isDarkMode ? "bg-[#111814]/80 backdrop-blur-xl border-emerald-900/30" : "bg-white/80 backdrop-blur-xl border-emerald-50"
        )}>
          {/* Title on mobile / Search bar on desktop */}
          <div className="md:hidden flex items-center gap-2.5 text-left">
             <div className="w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden shadow-md border border-emerald-500/10 shrink-0 bg-white">
                <img 
                  src={logoImg} 
                  alt="Farmetra Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
             </div>
             <div>
               <h1 className={cn(
                 "text-lg font-black tracking-tight leading-none text-[#1B4332] dark:text-white"
               )}>Farmetra</h1>
               <span className="text-[7px] text-[#8E9299] font-black uppercase tracking-wider block">
                 {t('detectProtectGrow')}
               </span>
             </div>
          </div>

          <div className={cn(
            "flex items-center gap-4 rounded-2xl px-4 py-2.5 w-full max-w-sm hidden md:flex border",
            isDarkMode ? "bg-white/5 border-emerald-900/20" : "bg-slate-50 border-transparent"
          )}>
            <Settings size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search diseases, crops or nutrients..." 
              className={cn(
                "bg-transparent text-xs font-bold outline-none w-full",
                isDarkMode ? "text-white placeholder:text-slate-650" : "text-slate-700"
              )}
            />
          </div>

          {/* Secure Online Sync status indicator & PWA Install Button */}
          <div className="flex items-center gap-3">
            {showInstallBtn && (
              <motion.button
                id="pwa-install-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all",
                  isDarkMode
                    ? "bg-[#1B4332] text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40 shadow-md shadow-emerald-950/30"
                    : "bg-[#1B4332] text-white border-transparent hover:bg-[#2d6a4f] shadow-md shadow-emerald-800/10"
                )}
              >
                <Download size={11} className="animate-bounce" />
                <span>Install App</span>
              </motion.button>
            )}

            <span className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-wider",
              isDarkMode 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-inner" 
                : "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm"
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('syncStatus')}
            </span>
          </div>
        </header>

        {/* Main core rendering area */}
        <main className="flex-1 overflow-y-auto pb-28 md:pb-14 relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* 3. Footer info - Desktop */}
        <footer className={cn(
          "hidden md:flex h-12 px-8 items-center justify-between text-[9px] font-black uppercase tracking-widest border-t shrink-0 transition-colors z-20",
          isDarkMode 
            ? "bg-[#111814] text-emerald-400/50 border-emerald-900/30" 
            : "bg-emerald-50 text-emerald-950/60 border-emerald-100"
        )}>
          <p>{t('localCnnDb')}</p>
          <p>© 2026 Farmetra Agri-Intelligence • Secure Admin: {USER_NAME}</p>
        </footer>

        {/* 4. Bottom Tab Bar Navigation - MOBILE ONLY (Perfect Mockup 2 representation) */}
        <nav className={cn(
          "md:hidden border-t px-2 py-2.5 flex justify-around items-center absolute bottom-0 w-full z-40 transition-all",
          isDarkMode ? "bg-[#111814] border-emerald-950/50" : "bg-white border-emerald-100"
        )}>
          {/* Item 1: Home Dashboard */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1",
              activeTab === 'dashboard' 
                ? "text-[#1B4332] dark:text-[#83f369] font-black scale-105" 
                : "text-slate-400 dark:text-slate-600"
            )}
          >
            <Home size={18} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-[8px] font-extrabold uppercase tracking-widest">{t('home')}</span>
          </button>

          {/* Item 2: Diagnostic History */}
          <button
            onClick={() => onTabChange('history')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1",
              activeTab === 'history' 
                ? "text-[#1B4332] dark:text-[#83f369] font-black scale-105" 
                : "text-slate-400 dark:text-slate-600"
            )}
          >
            <History size={18} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            <span className="text-[8px] font-extrabold uppercase tracking-widest">{t('history')}</span>
          </button>

          {/* Item 3: Raised Circular Scanner Camera Trigger (Center button mockup 2) */}
          <div className="relative w-16 h-12 flex items-center justify-center shrink-0">
            <button
              onClick={() => onTabChange('camera')}
              className={cn(
                "absolute -top-7 w-14 h-14 rounded-full bg-[#1B4332] dark:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-all border-4 transform active:scale-90 hover:scale-105",
                isDarkMode ? "border-[#111814] shadow-emerald-500/10" : "border-white shadow-emerald-950/20"
              )}
            >
              <Camera size={22} strokeWidth={2.5} />
            </button>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-600 absolute bottom-0.5">{t('scan')}</span>
          </div>

          {/* Item 4: Agronomy Guide */}
          <button
            onClick={() => onTabChange('guide')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1",
              activeTab === 'guide' 
                ? "text-[#1B4332] dark:text-[#83f369] font-black scale-105" 
                : "text-slate-400 dark:text-slate-600"
            )}
          >
            <Book size={18} strokeWidth={activeTab === 'guide' ? 2.5 : 2} />
            <span className="text-[8px] font-extrabold uppercase tracking-widest">{t('guide')}</span>
          </button>

          {/* Item 5: Administration Profile */}
          <button
            onClick={() => onTabChange('profile')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1",
              activeTab === 'profile' 
                ? "text-[#1B4332] dark:text-[#83f369] font-black scale-105" 
                : "text-slate-400 dark:text-slate-600"
            )}
          >
            <User size={18} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[8px] font-extrabold uppercase tracking-widest">{t('profile')}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

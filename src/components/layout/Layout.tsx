import { motion } from 'motion/react';
import { Home, Camera, Map, History, User, Settings, Sprout, Image } from 'lucide-react';
import { ReactNode } from 'react';
import { USER_NAME } from '../../constants';
import { cn } from '../../lib/utils';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Layout({ children, activeTab, onTabChange, isDarkMode, onToggleTheme }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'camera', icon: Camera, label: 'AI Diagnosis' },
    { id: 'gallery', icon: Image, label: 'Library' },
    { id: 'history', icon: History, label: 'Reports' },
  ];

  return (
    <div className={cn(
      "flex h-screen font-sans overflow-hidden transition-colors duration-500",
      isDarkMode ? "bg-[#0A0F0D] text-[#E0E7E1] dark" : "bg-[#F4F9F4] text-[#1B4332]"
    )}>
      {/* Background blobs for dynamic effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className={cn(
            "absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20",
            isDarkMode ? "bg-emerald-900" : "bg-emerald-200"
          )}
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className={cn(
            "absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20",
            isDarkMode ? "bg-blue-900" : "bg-blue-200"
          )}
        />
      </div>

      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden md:flex w-72 border-r flex-col shrink-0 z-20 transition-colors",
        isDarkMode ? "bg-[#111814] border-emerald-900/30" : "bg-white border-emerald-100"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 transform -rotate-3">
            <Sprout size={28} />
          </div>
          <h1 className={cn(
            "text-2xl font-black tracking-tight",
            isDarkMode ? "text-white" : "text-emerald-500"
          )}>Farmetra</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all mb-1",
                activeTab === tab.id 
                  ? (isDarkMode ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700 shadow-sm") 
                  : (isDarkMode ? "text-slate-500 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50")
              )}
            >
              <tab.icon size={20} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}

          <div className={cn("pt-6 mt-6 border-t", isDarkMode ? "border-emerald-900/30" : "border-slate-100")}>
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Administration</p>
            <button
              onClick={() => onTabChange('profile')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all mb-2",
                activeTab === 'profile' 
                  ? (isDarkMode ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700") 
                  : (isDarkMode ? "text-slate-500 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50")
              )}
            >
              <User size={20} />
              <span className="text-sm">Access Control</span>
            </button>
            
            <button
              onClick={onToggleTheme}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                isDarkMode ? "text-amber-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-sm text-left">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>

        <div className="p-6">
          <div className={cn(
            "rounded-2xl p-4 text-white shadow-lg transition-colors",
            isDarkMode ? "bg-emerald-950" : "bg-emerald-900"
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 font-bold text-xs uppercase">
                {USER_NAME.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <p className="text-xs font-bold truncate">{USER_NAME}</p>
            </div>
            <p className="text-[9px] text-emerald-300 font-medium opacity-80 uppercase tracking-widest">System Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full z-10">
        {/* Header */}
        <header className={cn(
          "h-20 border-b px-6 md:px-8 flex items-center justify-between shrink-0 transition-colors",
          isDarkMode ? "bg-[#111814]/80 backdrop-blur-xl border-emerald-900/30" : "bg-white border-emerald-50"
        )}>
          <div className={cn(
            "flex items-center gap-4 rounded-full px-5 py-2.5 w-full max-w-md hidden sm:flex border",
            isDarkMode ? "bg-white/5 border-emerald-900/20" : "bg-slate-100 border-transparent"
          )}>
            <Settings size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search diseases, outbreaks, or treatments..." 
              className={cn(
                "bg-transparent text-sm outline-none w-full",
                isDarkMode ? "text-white placeholder:text-slate-600" : "text-slate-700"
              )}
            />
          </div>
          
          <div className="md:hidden flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Sprout size={18} />
             </div>
             <h1 className={cn(
               "text-xl font-black tracking-tighter",
               isDarkMode ? "text-white" : "text-emerald-500"
             )}>Farmetra</h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={onToggleTheme}
              className="md:hidden p-2 rounded-full bg-emerald-100/10 text-emerald-400"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border shadow-sm",
              isDarkMode 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                : "bg-amber-50 bg-amber-50 text-amber-700 border-amber-100"
            )}>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              OFFLINE: ACTIVE
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-12 h-screen">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer - Desktop */}
        <footer className={cn(
          "hidden md:flex h-12 px-8 items-center justify-between text-[10px] font-bold border-t shrink-0 transition-colors",
          isDarkMode 
            ? "bg-[#111814] text-emerald-400/50 border-emerald-900/30" 
            : "bg-emerald-50 text-emerald-900/60 border-emerald-100"
        )}>
          <p>PlantVillage Dataset Engine v2.0 • Last Sync: 4 mins ago</p>
          <p>© 2024 Farmetra Agricultural Intelligence • Secure Admin: {USER_NAME}</p>
        </footer>

        {/* Bottom Nav - Mobile Only */}
        <nav className={cn(
          "md:hidden border-t px-4 py-3 flex justify-around items-center absolute bottom-0 w-full z-40 transition-colors",
          isDarkMode ? "bg-[#111814] border-emerald-900/30" : "bg-white border-emerald-100"
        )}>
          {tabs.concat([{ id: 'profile', icon: User, label: 'Profile' }]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeTab === tab.id 
                  ? "text-emerald-600 scale-110" 
                  : (isDarkMode ? "text-slate-600" : "text-slate-400")
              )}
            >
              <tab.icon size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

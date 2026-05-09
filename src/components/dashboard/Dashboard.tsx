import { motion } from 'motion/react';
import { Leaf, Zap, ChevronRight } from 'lucide-react';
import { Diagnosis } from '../../types';
import { cn } from '../../lib/utils';

interface DashboardProps {
  recentReports: Diagnosis[];
  onViewReport: (report: Diagnosis) => void;
  onLaunchCamera: () => void;
  historyCount: number;
}

export default function Dashboard({ recentReports, onViewReport, onLaunchCamera, historyCount }: DashboardProps) {
  const issuesCount = recentReports.filter(r => r.diseaseType !== 'Healthy').length;

  return (
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 content-start relative z-10">
      {/* Hero Section */}
      <section className="md:col-span-8 bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-sm border border-emerald-50 dark:border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[280px] transition-colors">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-emerald-900 dark:text-white mb-2 tracking-tighter uppercase">Diagnostic Engine</h2>
          <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-8 max-w-md text-sm md:text-base opacity-80 uppercase tracking-widest text-[10px]">
            CNN Pathogen Detection v4.2 • Secure Offline Analysis
          </p>
          <button 
            onClick={onLaunchCamera}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-10 py-4 md:py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-200 dark:shadow-none flex items-center gap-3 transition-all transform active:scale-95 self-start"
          >
            <Leaf size={20} />
            SCAN NEW SAMPLE
          </button>
        </div>
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full opacity-60" />
        
        <div className="absolute right-6 top-6 hidden sm:block">
           <div className="bg-white dark:bg-white/5 p-4 rounded-3xl shadow-xl border border-emerald-50 dark:border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
               <Zap size={20} />
             </div>
             <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SENSORS</p>
               <p className="text-xs font-bold dark:text-white">Active</p>
             </div>
           </div>
        </div>
      </section>

      {/* Health Score Card */}
      <section className="md:col-span-4 bg-emerald-900 dark:bg-emerald-950 rounded-[32px] p-8 text-white flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transition-colors">
        <div className="relative z-10 text-center w-full">
            <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.3em] opacity-60">System Summary</h3>
            <div className="relative flex items-center justify-center mb-8">
            <div className="w-40 h-40 rounded-full border-[1px] border-emerald-800 flex items-center justify-center relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-10px] rounded-full border-[2px] border-emerald-400 border-t-transparent" 
                />
                <span className="text-4xl font-black">{historyCount}</span>
            </div>
            </div>
            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Logs Captured</p>
            <div className="w-full">
            <div className="bg-emerald-800/40 dark:bg-black/20 p-4 rounded-2xl flex justify-between items-center">
                <span className="opacity-70 font-black uppercase text-[9px] tracking-widest text-white">Issues Found</span>
                <span className="font-black text-sm text-orange-400">{issuesCount}</span>
            </div>
            </div>
        </div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      </section>

      {/* Recent Activity */}
      <section className="md:col-span-12 bg-white dark:bg-white/5 rounded-[40px] p-10 shadow-sm border border-emerald-50 dark:border-white/10 flex flex-col transition-colors">
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
             <h3 className="font-black text-emerald-950 dark:text-white text-xl uppercase tracking-tighter">Diagnostic Registry</h3>
             <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active local sync</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <button
                key={report.id}
                onClick={() => onViewReport(report)}
                className="flex items-center gap-5 p-5 hover:bg-emerald-50/50 dark:hover:bg-white/10 rounded-[28px] transition-all cursor-pointer text-left border border-transparent hover:border-emerald-100 dark:hover:border-white/20 group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xs uppercase shadow-inner group-hover:scale-105 transition-transform",
                  report.severity === 'High' ? "bg-red-100 text-red-600" :
                  report.severity === 'Medium' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                )}>
                  {report.cropName[0]}{report.diseaseName.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-emerald-950 dark:text-white uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{report.diseaseName}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{report.cropName} • {new Date(report.timestamp).toLocaleTimeString()}</p>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
              </button>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-emerald-50 dark:border-white/10 rounded-[40px]">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                 <Leaf size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting pathogen scan</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
;

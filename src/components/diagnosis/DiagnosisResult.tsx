import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Diagnosis } from '../../types';
import { AlertCircle, CheckCircle2, ShieldCheck, Stethoscope, MapPin, Share2, Download, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DiagnosisResultProps {
  diagnosis: Diagnosis;
  onClose: () => void;
}

export default function DiagnosisResult({ diagnosis, onClose }: DiagnosisResultProps) {
  return (
    <div className="fixed inset-0 bg-[#F4F9F4] z-[110] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Visual Side */}
      <div className="h-[40vh] md:h-full md:w-1/2 relative shrink-0">
        <img src={diagnosis.imageUrl} className="w-full h-full object-cover md:rounded-r-[48px]" />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-emerald-950/90 tracking-tighter via-emerald-950/40 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
        >
          <X size={24} />
        </button>

        <div className="absolute bottom-8 left-8 right-8 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-lg",
              diagnosis.severity === 'High' ? "bg-red-600" :
              diagnosis.severity === 'Medium' ? "bg-orange-500" :
              "bg-emerald-500"
            )}>
              {diagnosis.severity} SEVERITY
            </span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black capitalize border border-white/10 tracking-widest">
              {diagnosis.diseaseType.toUpperCase()}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4 uppercase">{diagnosis.diseaseName}</h2>
          <div className="flex items-center gap-2 opacity-80">
            <div className="bg-emerald-400 w-2 h-2 rounded-full animate-pulse" />
            <p className="text-sm font-bold uppercase tracking-widest">{diagnosis.cropName} Pathogen Analysis</p>
          </div>
        </div>
      </div>

      {/* Data Side */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 md:bg-white md:m-6 md:rounded-[48px] shadow-2xl border border-emerald-50">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-emerald-900 text-2xl font-black tracking-tighter uppercase">AI Diagnostic Report</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{new Date(diagnosis.timestamp).toLocaleString()} • REF: {diagnosis.id.toUpperCase()}</p>
          </div>
          
          <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">CNN Engine Confidence</p>
              <p className="text-2xl font-black text-emerald-600">{Math.round(diagnosis.confidence * 100)}%</p>
            </div>
            <ShieldCheck size={32} className="text-emerald-600" />
          </div>
        </div>

        {/* Bento Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-[#1B4332]">
              <Stethoscope size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs">Visual Symptoms</h3>
            </div>
            <ul className="space-y-3">
              {diagnosis.symptoms.map((symptom, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#4A4A4A] font-medium leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {symptom}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#1B4332] text-white p-8 rounded-[32px] space-y-6 shadow-xl shadow-emerald-900/10">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs">Pathogen Protocol</h3>
            </div>
            <div className="space-y-4">
              {diagnosis.treatment.map((step, i) => (
                <div key={i} className="flex gap-4 text-sm opacity-90 leading-relaxed group">
                  <span className="font-black text-emerald-400 group-hover:scale-110 transition-transform">0{i+1}</span>
                  {step}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Preventive Measures */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-800">
            <AlertCircle size={20} />
            <h3 className="font-black uppercase tracking-widest text-xs">Integrated Farm Management</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.preventiveMeasures.map((measure, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm text-sm text-slate-700 font-medium hover:border-emerald-200 transition-colors">
                {measure}
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-8">
          <button className="flex items-center justify-center gap-3 bg-slate-100 text-slate-700 px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 active:scale-95 transition-all">
            <Download size={20} /> Download Report
          </button>
          <button className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-emerald-200 active:scale-95 transition-all">
            <Share2 size={20} /> Deploy Alert
          </button>
        </div>
      </div>
    </div>
  );
}

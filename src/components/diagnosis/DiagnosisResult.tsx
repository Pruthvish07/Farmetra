import { Check, ArrowLeft, Lightbulb } from "lucide-react";
import { Diagnosis } from "../../types";
import { cn } from "../../lib/utils";

interface DiagnosisResultProps {
  diagnosis: Diagnosis;
  onClose: () => void;
}

// Agrononmic map for scientific equivalents to match mockup 3
const scientificNames: Record<string, string> = {
  "Early Blight": "Alternaria solani",
  "Late Blight": "Phytophthora infestans",
  "Bacterial Spot": "Xanthomonas perforans",
  "Leaf Mold": "Passalora fulva",
  "Powdery Mildew": "Podosphaera macularis",
  "Yellow Leaf Curl Virus": "Tomato yellow leaf curl virus",
  "Mosaic Virus": "Tobamovirus mosaic",
  "Septoria Leaf Spot": "Septoria lycopersici",
  "Two-Spotted Spider Mite": "Tetranychus urticae",
  "Target Spot": "Corynespora cassiicola",
  "Healthy": "Optimum Health • No active pathogens",
};

export default function DiagnosisResult({ diagnosis, onClose }: DiagnosisResultProps) {
  const scientificName = scientificNames[diagnosis.diseaseName] || "Pathogen species unknown";

  // Map low/medium/high to visual severity matching the mockup
  const riskLabels: Record<string, string> = {
    Low: "Minimal",
    Medium: "Moderate",
    High: "Critical Priority",
  };

  const riskClasses: Record<string, string> = {
    Low: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50",
    Medium: "bg-[#FFF2E6] text-[#E67A00] dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200/50",
    High: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50",
  };

  return (
    <div className="fixed inset-0 bg-[#F4F9F4] dark:bg-[#0A0F0D] z-[120] flex flex-col font-sans select-none overflow-y-auto">
      {/* Header bar matches mockup 3 */}
      <header className="h-16 px-6 bg-white dark:bg-[#111814] flex items-center gap-4 shrink-0 border-b border-[#E5E5E5]/50 dark:border-white/5 shadow-sm sticky top-0 z-30">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 rounded-xl text-[#1B4332] dark:text-[#E0E7E1] hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-extrabold text-[#1B4332] dark:text-white text-base tracking-tight uppercase">
          Detect Disease
        </h2>
      </header>

      {/* Main two sections container */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        
        {/* 1. Viewport scanning frame matching mockup 3 */}
        <div className="w-full h-72 rounded-[32px] overflow-hidden relative border-4 border-white dark:border-[#111814] shadow-xl bg-black">
          <img 
            src={diagnosis.imageUrl} 
            alt={diagnosis.cropName} 
            className="w-full h-full object-cover opacity-90" 
          />
          
          {/* Target Scan Corner Brackets */}
          <div className="absolute inset-6 pointer-events-none">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
          </div>

          {/* Floating bulb icon at the upper-right */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-md animate-pulse">
            <Lightbulb size={18} />
          </div>

          {/* Location / Meta Overlay */}
          <div className="absolute bottom-4 left-6 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            CNN SENSOR CONFIDENCE: {Math.round(diagnosis.confidence * 100)}%
          </div>
        </div>

        {/* 2. Results specification sheet card */}
        <div className="bg-white dark:bg-[#111814] rounded-[36px] p-6 border border-[#E5E5E5] dark:border-white/5 shadow-xl space-y-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black uppercase text-[#8E9299] tracking-widest block">
              Result
            </span>
            <h3 className="text-2xl font-black text-[#CE4A4A] dark:text-red-400 tracking-tight leading-none uppercase">
              {diagnosis.diseaseName}
            </h3>
            <p className="text-xs font-semibold text-slate-500 italic mt-0.5">
              ({scientificName})
            </p>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-[#E5E5E5]/50 dark:border-white/5 py-4 text-xs font-bold">
            <div className="space-y-1 text-left">
              <span className="text-[9px] text-[#8E9299] uppercase tracking-widest block font-bold">Risk Level</span>
              <span className={cn("px-3.5 py-1 rounded-xl text-[10px] font-black inline-block uppercase tracking-wider", riskClasses[diagnosis.severity] || riskClasses.Medium)}>
                {riskLabels[diagnosis.severity] || "Moderate"}
              </span>
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[9px] text-[#8E9299] uppercase tracking-widest block font-bold">Affected Crop</span>
              <span className="text-sm font-black text-[#1B4332] dark:text-white uppercase tracking-tight block pt-0.5">
                {diagnosis.cropName}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 font-medium">
              {diagnosis.diseaseName === "Healthy" 
                ? "This crop crop is demonstrating optimum leaf health. Keep applying standard water and organic fertilizer as indicated." 
                : `${diagnosis.diseaseName} is a severe pathogen that spreads through water splash and warm, damp conditions. Early localized mitigation will prevent rapid outbreak expansion across surrounding foliage.`}
            </p>
          </div>

          {/* Recommended Solutions List */}
          <div className="space-y-3.5 text-left">
            <h4 className="text-[10px] font-black text-[#1B4332] dark:text-emerald-400 uppercase tracking-widest font-bold">
              Recommended Solutions
            </h4>
            <div className="space-y-2.5">
              {(diagnosis.treatment.length > 0 ? diagnosis.treatment : ["Remove infested lower leaves to stop splash-back transmission", "Spray copper fungicides or bio-agents sequentially", "Sanitize all pruning tools regularly with alcohol wipes", "Avoid sprinkler overhead watering; convert to soil-base drip"]).map((sol, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-normal">
                    {sol}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Save to History Bottom Action Button */}
          <button 
            onClick={onClose}
            className="w-full bg-[#1B4332] hover:bg-[#143326] text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl shadow-xl hover:shadow-emerald-900/10 active:scale-95 transition-all text-center flex items-center justify-center"
          >
            Save to History
          </button>
        </div>
      </div>
    </div>
  );
}

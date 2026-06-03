import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  ChevronRight, 
  Scan, 
  ShieldAlert, 
  BookOpen, 
  CloudSun, 
  Droplet, 
  Gauge, 
  X, 
  CheckCircle,
  Thermometer,
  Wind
} from "lucide-react";
import { Diagnosis } from "../../types";
import { cn } from "../../lib/utils";

interface DashboardProps {
  recentReports: Diagnosis[];
  onViewReport: (report: Diagnosis) => void;
  onLaunchCamera: () => void;
  historyCount: number;
  onNavigateToTab: (tab: string) => void;
}

export default function Dashboard({ 
  recentReports, 
  onViewReport, 
  onLaunchCamera, 
  historyCount,
  onNavigateToTab 
}: DashboardProps) {
  // Modal active states for the 6 bento tools
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Soil health simulator state
  const [soilType, setSoilType] = useState("Loamy");
  const [nitrogen, setNitrogen] = useState(65);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(75);

  // Weather station simulation
  const weatherMetrics = {
    temp: 24,
    humidity: 62,
    rainfallChance: "10%",
    status: "Partly Cloudy",
    advisory: "Excellent day for bio-fungicide foliar spraying. Low wind speeds."
  };

  return (
    <div className="p-6 md:p-8 space-y-8 select-none max-w-7xl mx-auto pb-24">
      {/* 1. Hero banner: Forest Green Theme with Young Seedling Graphic */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#143E2C] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4 md:max-w-md relative z-10 text-left">
          <span className="bg-[#83f369]/20 text-[#83f369] font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full border border-[#83f369]/20">
            FALCON CORE ENG v4.2
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Hello, Farmer! 👋
          </h2>
          <p className="text-emerald-100/80 font-semibold text-sm leading-relaxed">
            Let's protect your crops and grow better. Run live neural scans on your leaves to detect pathogens instantly.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onLaunchCamera}
              className="bg-[#83f369] hover:bg-[#72e059] text-[#1B4332] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Scan size={16} /> Scan Leaves
            </button>
            <button
              onClick={() => onNavigateToTab('guide')}
              className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl transition-colors"
            >
              Browse Diagnosis Guide
            </button>
          </div>
        </div>

        {/* CSS/SVG Seedling graphic right side of mockup */}
        <div className="w-36 h-36 relative z-10 shrink-0 flex items-center justify-center bg-white/5 rounded-full p-2 border border-white/10 shadow-inner">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Mound of dirt/soil */}
            <path d="M20 80C20 70 35 65 50 65C65 65 80 70 80 80Z" fill="#5C4033" />
            
            {/* Main stem growing up */}
            <path d="M50 70C50 50 48 35 55 20" stroke="#83f369" strokeWidth="4" strokeLinecap="round" />
            
            {/* Seed leaves (Cotyledons) spreading out */}
            <path d="M50 50C40 45 32 48 35 55C38 62 48 55 50 50Z" fill="#83f369" stroke="#72e059" strokeWidth="1" />
            <path d="M51 45C60 40 68 43 65 50C62 57 52 50 51 45Z" fill="#83f369" stroke="#72e059" strokeWidth="1" />
            
            {/* Top newly unfurling leaf sprout */}
            <path d="M55 20C48 12 52 5 62 10C72 15 62 21 55 20Z" fill="#B3FFB3" stroke="#83f369" strokeWidth="1" />
            
            {/* Active shining sun rays */}
            <circle cx="80" cy="20" r="8" fill="#FDB813" />
            <line x1="80" y1="6" x2="80" y2="10" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
            <line x1="66" y1="20" x2="70" y2="20" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="10" x2="73" y2="13" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-emerald-800/20 rounded-full blur-2xl" />
      </section>

      {/* 2. Bento Grid: 6 Actionable Cards (exact design mapping to mockup 2) */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Detect Disease */}
        <button
          onClick={onLaunchCamera}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Scan size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Detect Disease</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Identify crop diseases using AI scanner</p>
          </div>
        </button>

        {/* Card 2: Crop Protection */}
        <button
          onClick={() => setActiveModal("protection")}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <ShieldAlert size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Crop Protection</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Get organic protection solutions</p>
          </div>
        </button>

        {/* Card 3: Crop Guide */}
        <button
          onClick={() => onNavigateToTab('guide')}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <BookOpen size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Crop Guide</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Detailed information and crop sheets</p>
          </div>
        </button>

        {/* Card 4: Weather */}
        <button
          onClick={() => setActiveModal("weather")}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <CloudSun size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Weather</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Live microclimate forecast alerts</p>
          </div>
        </button>

        {/* Card 5: Fertilizer Guide */}
        <button
          onClick={() => setActiveModal("fertilizer")}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Droplet size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Fertilizer Guide</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Determine optimal N-P-K balances</p>
          </div>
        </button>

        {/* Card 6: Soil Health */}
        <button
          onClick={() => setActiveModal("soil")}
          className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[28px] border border-[#E5E5E5] dark:border-white/10 text-left transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 group active:scale-95 flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#1B4332] dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Gauge size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs uppercase tracking-tight text-[#1B4332] dark:text-white">Soil Health</h3>
            <p className="text-[10px] text-[#8E9299] font-medium leading-normal">Test, monitor & calculate amendments</p>
          </div>
        </button>
      </section>

      {/* 3. Recent Detection Registry Title & View All */}
      <section className="bg-white dark:bg-white/5 rounded-[32px] p-6 border border-[#E5E5E5] dark:border-white/10 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5 text-left">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#1B4332] dark:text-white">
              🌱 Recent Detections
            </h3>
            <p className="text-[10px] text-[#8E9299] font-bold uppercase tracking-wider">
              Diagnostic registry overview
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('history')}
            className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-wider"
          >
            View All
          </button>
        </div>

        {/* List of reports showing thumbnails exactly corresponding to mockup 2 */}
        <div className="space-y-4">
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <button
                key={report.id}
                onClick={() => onViewReport(report)}
                className="w-full flex items-center justify-between p-4 bg-[#F8FAF8] dark:bg-white/5 border border-emerald-500/5 hover:border-emerald-500/20 rounded-2xl transition-all hover:shadow-md cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Rounded crop thumbnail on the left */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-emerald-100 dark:border-white/15 bg-slate-200">
                    <img 
                      src={report.imageUrl} 
                      alt={report.cropName} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#1B4332] dark:text-white uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                      {report.cropName} - {report.diseaseName}
                    </h4>
                    <span className="text-[10px] font-bold text-[#8E9299] uppercase tracking-wider block">
                      Detected on {new Date(report.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    
                    {/* Risk Badge */}
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-0.5 rounded-full inline-block uppercase tracking-widest outline border mt-1",
                      report.severity === 'High' ? "bg-red-50 text-red-700 border-red-100" :
                      report.severity === 'Medium' ? "bg-orange-50 text-orange-700 border-orange-100" :
                      "bg-blue-50 text-blue-700 border-blue-100"
                    )}>
                      {report.severity} Risk
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect
                  </span>
                  <ChevronRight size={18} className="text-[#8E9299]/50 group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-14 text-center border-2 border-dashed border-emerald-100 dark:border-white/10 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                 <Scan size={20} />
              </div>
              <p className="text-xs font-black text-[#1B4332]/60 uppercase tracking-widest">
                No local diagnostic scans captured yet
              </p>
              <button 
                onClick={onLaunchCamera}
                className="mt-3 bg-[#1B4332] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl"
              >
                Scan Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. MODALS FOR BENTO TOOLS */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 font-sans select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111814] w-full max-w-lg rounded-[32px] p-6 shadow-2xl relative border border-emerald-900/10 overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-[#E5E5E5]/50 pb-4 mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#1B4332] dark:text-emerald-400">
                  {activeModal === "protection" && "🌱 Integrated Crop Protection"}
                  {activeModal === "weather" && "🌤️ Agro-Chemical Weather Station"}
                  {activeModal === "fertilizer" && "🧪 Dynamic N-P-K Fertilizer Assistant"}
                  {activeModal === "soil" && "🎛️ Digital Soil Analysis Laboratory"}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Protection Content */}
              {activeModal === "protection" && (
                <div className="space-y-4">
                  <p className="text-xs text-[#8E9299] font-medium leading-relaxed">
                    Access our system recommendations on field protection and environmental sanitation setup is key:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-900/20">
                      <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-black uppercase text-[#1B4332] dark:text-emerald-400">Crop Rotation Cycle</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Maintain a 3-year gap before planting same crop families to break pest hibernation chains.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl flex items-start gap-3 border border-amber-100 dark:border-amber-900/10">
                      <CheckCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-400">Field Sanitation Rule</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Always destroy and bury infested residue. Never compost diseased vines to avoid soil contamination.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-900/10">
                      <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-black uppercase text-blue-800 dark:text-blue-400">Watering Timing</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Irrigate solely at the soil base utilizing drip systems. Overhead spraying keeps foliage wet, fueling fungal spores.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Content */}
              {activeModal === "weather" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-orange-50 dark:bg-orange-500/5 rounded-2xl text-center border border-orange-100 dark:border-orange-500/10">
                      <Thermometer className="mx-auto text-orange-600 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temperature</span>
                      <p className="text-lg font-black text-orange-950 dark:text-orange-200">{weatherMetrics.temp}°C</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl text-center border border-blue-100 dark:border-blue-500/10">
                      <Droplet className="mx-auto text-blue-600 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Humidity</span>
                      <p className="text-lg font-black text-blue-950 dark:text-blue-200">{weatherMetrics.humidity}%</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl text-center border border-amber-100 dark:border-amber-500/10">
                      <Wind className="mx-auto text-amber-600 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rain Chance</span>
                      <p className="text-lg font-black text-amber-950 dark:text-amber-200">{weatherMetrics.rainfallChance}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1B4332] text-white rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Agronomist Advisory</h4>
                    <p className="text-xs leading-relaxed opacity-95 pt-1 font-medium">{weatherMetrics.advisory}</p>
                  </div>
                </div>
              )}

              {/* Fertilizer Content */}
              {activeModal === "fertilizer" && (
                <div className="space-y-5">
                  <p className="text-xs text-[#8E9299]">
                    Set NPK values ratio percentages to test and calculate corresponding organic options.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Nitrogen (N) - Leaf Growth</span>
                        <span>{nitrogen}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={nitrogen} onChange={(e) => setNitrogen(Number(e.target.value))}
                        className="w-full h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Phosphorus (P) - Roots/Flowers</span>
                        <span>{phosphorus}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={phosphorus} onChange={(e) => setPhosphorus(Number(e.target.value))}
                        className="w-full h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Potassium (K) - General Vigor</span>
                        <span>{potassium}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={potassium} onChange={(e) => setPotassium(Number(e.target.value))}
                        className="w-full h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8FAF8] dark:bg-white/5 border border-emerald-500/10 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase text-emerald-600">Organic Remedy Recommendation</h4>
                    <p className="text-xs pt-1.5 font-bold leading-normal text-[#1B4332] dark:text-emerald-100">
                      {nitrogen > 70 ? "High Nitrogen. Incorporate wood shavings or dry leaves to offset. Apply bone meal to boost Phosphorus." : 
                       nitrogen < 30 ? "Nitrogen Deficient! Spray diluted fish emulsion extract or apply well-rotted chicken manure." : 
                       "Perfect NPK ratio. Apply balanced home compost and compost tea spray twice monthly."}
                    </p>
                  </div>
                </div>
              )}

              {/* Soil Content */}
              {activeModal === "soil" && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Select Soil Base Type</label>
                    <select 
                      value={soilType} 
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full p-3 border border-[#E5E5E5] dark:border-white/10 dark:bg-emerald-950/20 rounded-xl text-xs font-bold outline-none text-[#1B4332] dark:text-emerald-100"
                    >
                      <option value="Loamy">Loamy - Optimal Aeration / Retention</option>
                      <option value="Clayey">Clayey - Tight Drainage / Waterlogged</option>
                      <option value="Sandy">Sandy - Fast Drainage / Low Nutrients</option>
                      <option value="Silty">Silty - High Fertility / Dense</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Diagnosed Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600 dark:text-[#8E9299]">Active pH Index</span>
                        <span className="font-extrabold text-[#1B4332] dark:text-white">6.4 (Slightly Acidic - Ideal)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600 dark:text-[#8E9299]">Moisture Retention Cap</span>
                        <span className="font-extrabold text-[#1B4332] dark:text-white">{soilType === 'Loamy' ? '82% - Excellent' : soilType === 'Sandy' ? '30% - Low Drainage Risk' : '95% - High Waterlogging Risk'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600 dark:text-[#8E9299]">Organic Matter Content</span>
                        <span className="font-extrabold text-emerald-600">5.8% (Satisfactory)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-xl text-xs leading-normal font-medium border border-amber-500/10">
                    <strong>Laboratory Advice:</strong> {soilType === 'Clayey' ? "Incorporate abundant organic peat moss and wood chips to form channels and aerate compact particles." : soilType === 'Sandy' ? "Add vermicompost and multi-layer mulching to capture water molecules and bind loose sand grains." : "Exceptional matrix! Retain dynamic surface cover-crops to nourish root biological networks."}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

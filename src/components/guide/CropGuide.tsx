import { useState } from "react";
import plantData from "../../data/plant_dataset.json";
import { Book, Thermometer, Droplet, Sprout, Sun, ShieldAlert, CheckCircle, Info, Beaker } from "lucide-react";
import { cn } from "../../lib/utils";

export default function CropGuide() {
  const [selectedPlantId, setSelectedPlantId] = useState(plantData.plants[0].plant_id);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);

  const selectedPlant = plantData.plants.find((p) => p.plant_id === selectedPlantId) || plantData.plants[0];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tighter uppercase text-[#1B4332] dark:text-white flex items-center gap-2">
          <Book size={24} className="text-emerald-600" /> Advanced Agronomy Guide
        </h2>
        <p className="text-[#8E9299] text-xs font-bold uppercase tracking-widest leading-relaxed">
          Explore optimal growing profiles, disease signatures, and treatment protocols
        </p>
      </div>

      {/* Grid selector of crops */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {plantData.plants.map((plant) => {
          const isSelected = plant.plant_id === selectedPlantId;
          return (
            <button
              key={plant.plant_id}
              onClick={() => {
                setSelectedPlantId(plant.plant_id);
                setSelectedDiseaseId(null);
              }}
              className={cn(
                "p-4 rounded-2xl border text-center transition-all duration-300 transform active:scale-95 flex flex-col items-center justify-center gap-2 group relative overflow-hidden",
                isSelected
                  ? "bg-[#1B4332] border-[#1B4332] text-white shadow-xl shadow-emerald-900/10"
                  : "bg-white dark:bg-white/5 border-[#E5E5E5] dark:border-white/10 text-[#1B4332] dark:text-emerald-100 hover:border-emerald-500/50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isSelected ? "bg-emerald-500 text-white" : "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 group-hover:scale-110"
                )}
              >
                <Sprout size={20} />
              </div>
              <span className="font-extrabold text-xs tracking-tight uppercase">{plant.common_name}</span>
              <span className="text-[9px] font-medium italic opacity-75">{plant.scientific_name}</span>
            </button>
          );
        })}
      </div>

      {/* Main detail sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Crop condition profile & diseases list */}
        <div className="lg:col-span-4 space-y-6">
          {/* Optimal Conditions Panel */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-[#E5E5E5] dark:border-white/10 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1B4332] dark:text-emerald-400 border-b border-[#E5E5E5]/50 dark:border-white/10 pb-3">
              Optimal Profile
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 shrink-0">
                  <Thermometer size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temperature</h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{selectedPlant.optimal_conditions.temperature_range}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 shrink-0">
                  <Droplet size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Watering</h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{selectedPlant.optimal_conditions.watering_frequency}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 shrink-0">
                  <Sprout size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soil Type</h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{selectedPlant.optimal_conditions.soil_type}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 shrink-0">
                  <Sun size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sunlight</h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{selectedPlant.optimal_conditions.sunlight}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diseases Sublist */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-[#E5E5E5] dark:border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1B4332] dark:text-emerald-400">
              Common Pathogens
            </h3>
            <div className="space-y-3">
              {selectedPlant.diseases.map((d) => {
                const isSelected = selectedDiseaseId === d.disease_id;
                return (
                  <button
                    key={d.disease_id}
                    onClick={() => setSelectedDiseaseId(d.disease_id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 transform active:scale-95 group",
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-transparent border-[#E5E5E5] dark:border-white/10 hover:border-emerald-500/30 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div>
                      <h4 className="font-extrabold text-xs uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {d.disease_name}
                      </h4>
                      <p className="text-[10px] font-semibold opacity-60 mt-0.5">{d.causal_agent}</p>
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider",
                        d.severity_level === "High"
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : d.severity_level === "Medium"
                          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      )}
                    >
                      {d.severity_level}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Selected Disease Details */}
        <div className="lg:col-span-8">
          {selectedDiseaseId ? (
            (() => {
              const disease = selectedPlant.diseases.find((d) => d.disease_id === selectedDiseaseId)!;
              return (
                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 md:p-10 border border-[#E5E5E5] dark:border-white/10 space-y-8 animate-fadeIn">
                  {/* Title Bar */}
                  <div className="border-b border-[#E5E5E5]/50 dark:border-white/10 pb-6 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                        {selectedPlant.common_name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg",
                          disease.severity_level === "High"
                            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            : disease.severity_level === "Medium"
                            ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        )}
                      >
                        {disease.severity_level} Risk Level
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-[#1B4332] dark:text-white uppercase tracking-tighter pt-1">
                      {disease.disease_name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 italic">
                      Causal Agent: {disease.causal_agent}
                    </p>
                  </div>

                  {/* Symptoms & Prevention split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Symptoms */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                        <ShieldAlert size={16} /> Diagnostic Symptoms
                      </h4>
                      <ul className="space-y-3">
                        {disease.symptoms.map((sym, index) => (
                          <li key={index} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            {sym}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle size={16} /> Prevention Protocol
                      </h4>
                      <ul className="space-y-3">
                        {disease.prevention_tips.map((prev, index) => (
                          <li key={index} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {prev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Organic & Chemical Treatments Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E5E5E5]/50 dark:border-white/10">
                    {/* Organic Treatment */}
                    <div className="bg-[#1B4332] text-white p-6 rounded-[28px] space-y-4 shadow-xl">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                        <Sprout size={16} /> Organic Remediation
                      </h4>
                      <ul className="space-y-3">
                        {disease.organic_control.map((org, idx) => (
                          <li key={idx} className="flex gap-3 text-xs leading-relaxed opacity-90 font-medium">
                            <span className="text-emerald-400 font-extrabold">{idx + 1}.</span>
                            {org}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Control */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[28px] border border-slate-100 dark:border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <Beaker size={16} /> Chemical Controls
                      </h4>
                      <ul className="space-y-3">
                        {disease.chemical_control.map((chem, idx) => (
                          <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            <span className="text-blue-500 font-extrabold">{idx + 1}.</span>
                            {chem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white dark:bg-white/5 p-12 rounded-[40px] border border-[#E5E5E5] dark:border-white/10 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
                <Info size={28} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-widest text-[#1B4332] dark:text-white">Select a Pathogen Profile</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2 max-w-sm">
                Tap on any of the common pathogens on the left to see symptoms, remedies, chemical applications, and prevention guides
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

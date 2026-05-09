import { motion } from 'motion/react';
import { Search, Info, Leaf, Bug, Droplets, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const DISEASE_LIBRARY = [
  {
    name: 'Early Blight',
    crop: 'Tomato',
    type: 'Fungal',
    image: 'https://images.unsplash.com/photo-1592321114652-cf827af74115?auto=format&fit=crop&q=80&w=400',
    description: 'Concentric rings on lower leaves, eventually causing yellowing and leaf drop.'
  },
  {
    name: 'Late Blight',
    crop: 'Potato',
    type: 'Fungal',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=400',
    description: 'Rapidly spreading dark brown spots with a white moldy growth on the underside.'
  },
  {
    name: 'Mosaic Virus',
    crop: 'Corn',
    type: 'Viral',
    image: 'https://images.unsplash.com/photo-1551029506-0807d462ebae?auto=format&fit=crop&q=80&w=400',
    description: 'Mottled yellow and green patterns on leaves, stunted growth and distorted ears.'
  },
  {
    name: 'Powdery Mildew',
    crop: 'Grape',
    type: 'Fungal',
    image: 'https://images.unsplash.com/photo-1536647245847-ebc3e449a14e?auto=format&fit=crop&q=80&w=400',
    description: 'White, powdery coating on leaves and stems, reducing photosynthesis.'
  },
  {
    name: 'Citrus Canker',
    crop: 'Lemon',
    type: 'Bacterial',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=400',
    description: 'Raised, corky lesions with yellow halos on leaves, twigs, and fruit.'
  },
  {
    name: 'Black Rot',
    crop: 'Apple',
    type: 'Fungal',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400',
    description: 'Small purple spots that enlarge into "frog-eye" lesions on leaves.'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? DISEASE_LIBRARY : DISEASE_LIBRARY.filter(d => d.type === filter);

  return (
    <div className="p-6 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-emerald-500 dark:text-white">Disease Library</h2>
          <p className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px]">Reference database for field pathogen identification</p>
        </div>
        
        <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-emerald-100 dark:border-white/10 shadow-sm overflow-x-auto">
          {['All', 'Fungal', 'Bacterial', 'Viral'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === cat 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none" 
                  : "text-slate-400 hover:text-emerald-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((disease, idx) => (
          <motion.div
            key={disease.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white dark:bg-[#111814] rounded-[40px] overflow-hidden border border-emerald-50 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
          >
            <div className="h-64 relative overflow-hidden">
              <img 
                src={disease.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-60" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg",
                    disease.type === 'Viral' ? 'bg-red-500' : 
                    disease.type === 'Bacterial' ? 'bg-amber-500' : 'bg-blue-500'
                )}>
                    {disease.type}
                </span>
              </div>
            </div>
            
            <div className="p-8 space-y-4">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{disease.name}</h4>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Found in {disease.crop}</p>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                {disease.description}
              </p>
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 dark:bg-white/5 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all">
                <Info size={14} /> Full Pathogen Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Search Prompt */}
      <div className="bg-emerald-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="relative z-10 space-y-4 max-w-lg">
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Can't find a match?</h3>
            <p className="text-emerald-300 font-medium text-sm leading-relaxed">
              Our AI database is constantly expanding. Use the scanner tool to identify unidentified pathogens and contribute to regional agriculture safety.
            </p>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-700">
                  <Leaf size={14} className="text-emerald-400" /> 12K+ Samples
               </div>
               <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-700">
                  <Zap size={14} className="text-emerald-400" /> Real-time
               </div>
            </div>
         </div>
         <button className="relative z-10 w-full md:w-auto bg-white text-emerald-950 px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">
            Upload Sample
         </button>
         <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] bg-emerald-400 rounded-full opacity-10 blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

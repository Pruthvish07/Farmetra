import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, RotateCcw, Zap, Info, X, Image as ImageIcon } from 'lucide-react';
import { analyzeCropImage } from '../../services/aiService';
import { Diagnosis } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CameraScreenProps {
  onDiagnosisComplete: (diagnosis: Diagnosis) => void;
  onCancel: () => void;
}

export default function CameraScreen({ onDiagnosisComplete, onCancel }: CameraScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access restricted. Switching to upload mode.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        handleAnalysis(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      handleAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCropImage(imageData);
      onDiagnosisComplete(result);
    } catch (err) {
      setError("AI analysis failed. Please try a different photo.");
      setCapturedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans">
      {/* Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-dashed border-emerald-400 rounded-2xl relative overflow-hidden">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                
                {/* Scanner Beam Animation */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                />
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/5"
                />
              </div>
            </div>
          </>
        ) : (
          <img src={capturedImage} className="w-full h-full object-cover" />
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 p-8 text-center"
            >
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-xl font-black tracking-tighter uppercase mb-2">Analyzing Pathogens</p>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest opacity-60">Consulting PlantVillage Engine v4.2</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="absolute top-24 left-6 right-6 bg-red-600/90 backdrop-blur text-white p-4 rounded-xl flex items-center gap-3 z-50 shadow-xl border border-white/10">
            <Info size={20} />
            <p className="text-xs font-bold leading-tight uppercase tracking-wider">{error}</p>
          </div>
        )}

        {/* Header Controls */}
        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center text-white z-40">
          <button onClick={onCancel} className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 active:scale-95 transition-all">
            <X size={20} />
          </button>
          <div className="flex bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Scanner</span>
          </div>
          <button className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 active:scale-95 transition-all">
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-[#0D0F0E] p-10 shrink-0 border-t border-white/5 flex flex-col items-center relative">
        <p className="text-[#8E9299] text-[10px] uppercase tracking-[0.3em] mb-10 font-black">Center leaf or upload image</p>
        
        <div className="flex items-center gap-12">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[#8E9299] flex flex-col items-center gap-2 hover:text-white transition-colors active:scale-90"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ImageIcon size={22} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">Library</span>
          </button>
          
          <button 
            onClick={capturePhoto}
            disabled={isAnalyzing}
            className={cn(
              "w-20 h-20 rounded-full border-4 border-[#8E9299] p-1 transition-all active:scale-90 shadow-2xl",
              isAnalyzing ? "opacity-20 translate-y-2" : "opacity-100"
            )}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#0D0F0E] shadow-inner">
              <CameraIcon size={28} />
            </div>
          </button>

          <button 
            onClick={() => {
              setCapturedImage(null);
              setError(null);
            }} 
            className="text-[#8E9299] flex flex-col items-center gap-2 hover:text-white transition-colors active:scale-90"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <RotateCcw size={22} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">Reset</span>
          </button>
        </div>

        <div className="mt-10 flex gap-4">
          <div className="px-3 py-1.5 border border-white/10 rounded-lg text-[9px] font-black text-[#8E9299] uppercase tracking-widest bg-white/5">ISO 800</div>
          <div className="px-3 py-1.5 border border-white/10 rounded-lg text-[9px] font-black text-[#8E9299] uppercase tracking-widest bg-white/5">CNN: v4.2</div>
          <div className="px-3 py-1.5 border border-white/10 rounded-lg text-[9px] font-black text-[#8E9299] uppercase tracking-widest bg-white/5">BUFFER: OK</div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, RotateCcw, Zap, Info, X } from 'lucide-react';
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
      setError("Unable to access camera. Please check permissions.");
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

  const handleAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCropImage(imageData);
      onDiagnosisComplete(result);
    } catch (err) {
      setError("AI analysis failed. Please try again.");
      setCapturedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-mono">
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
            >
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-xl font-bold tracking-tighter uppercase">Analyzing Pathogens</p>
              <p className="text-xs opacity-60 mt-2">Consulting PlantVillage database...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="absolute top-20 left-6 right-6 bg-red-600 text-white p-4 rounded-xl flex items-center gap-3">
            <Info size={20} />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        {/* Header Controls */}
        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center text-white">
          <button onClick={onCancel} className="bg-white/10 backdrop-blur p-2 rounded-full border border-white/20">
            <X size={20} />
          </button>
          <div className="flex bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live Sensor</span>
          </div>
          <button className="bg-white/10 backdrop-blur p-2 rounded-full border border-white/20">
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-[#151619] p-10 shrink-0 border-t border-white/5 flex flex-col items-center">
        <p className="text-[#8E9299] text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Center leaf in guide</p>
        
        <div className="flex items-center gap-12">
          <button onClick={() => setCapturedImage(null)} className="text-[#8E9299] flex flex-col items-center gap-1">
            <RotateCcw size={24} />
            <span className="text-[8px] uppercase tracking-widest">Reset</span>
          </button>
          
          <button 
            onClick={capturePhoto}
            disabled={isAnalyzing}
            className={cn(
              "w-20 h-20 rounded-full border-4 border-[#8E9299] p-1 transition-all active:scale-90",
              isAnalyzing ? "opacity-20" : "opacity-100"
            )}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-black">
              <CameraIcon size={24} />
            </div>
          </button>

          <div className="flex flex-col items-center gap-1 opacity-20">
            <Info size={24} className="text-[#8E9299]" />
            <span className="text-[8px] uppercase tracking-widest">Docs</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <div className="px-2 py-1 border border-white/10 rounded text-[8px] text-[#8E9299] uppercase tracking-widest bg-white/5">ISO 800</div>
          <div className="px-2 py-1 border border-white/10 rounded text-[8px] text-[#8E9299] uppercase tracking-widest bg-white/5">AI: V3.2</div>
          <div className="px-2 py-1 border border-white/10 rounded text-[8px] text-[#8E9299] uppercase tracking-widest bg-white/5">GPS: LOCK</div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

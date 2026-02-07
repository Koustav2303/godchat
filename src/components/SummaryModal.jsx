import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";

const SummaryModal = () => {
  const { isGeneratingSummary, summaryResult, closeSummary } = useChatStore();
  const [displayedText, setDisplayedText] = useState("");

  // Typewriter effect logic
  useEffect(() => {
    if (summaryResult) {
      let index = 0;
      setDisplayedText(""); // Reset
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + summaryResult.charAt(index));
        index++;
        if (index >= summaryResult.length) clearInterval(interval);
      }, 20); // Typing speed
      return () => clearInterval(interval);
    }
  }, [summaryResult]);

  if (!isGeneratingSummary && !summaryResult) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={closeSummary}
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">AI Conversation Insight</h2>
          </div>
          {!isGeneratingSummary && (
              <button onClick={closeSummary} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 min-h-[200px] flex flex-col">
            
            {/* Loading State */}
            {isGeneratingSummary && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                        <BrainCircuit className="w-16 h-16 text-purple-500 animate-pulse" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 w-full h-full border-4 border-t-purple-400 border-r-transparent border-b-purple-400 border-l-transparent rounded-full opacity-50"
                        />
                    </div>
                    <p className="text-purple-300 font-mono text-sm animate-pulse">Scanning conversation history...</p>
                </div>
            )}

            {/* Result State */}
            {!isGeneratingSummary && summaryResult && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <CheckCircle2 className="w-4 h-4" /> Analysis Complete
                    </div>
                    
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-base">
                            {displayedText}
                            <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse align-middle" />
                        </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                        <button 
                            onClick={() => { navigator.clipboard.writeText(summaryResult); }}
                            className="text-xs text-slate-400 hover:text-white transition underline"
                        >
                            Copy to clipboard
                        </button>
                    </div>
                </div>
            )}

        </div>
      </motion.div>
    </div>
  );
};

export default SummaryModal;
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, Code2, X, Hammer } from "lucide-react";

const DevNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay for dramatic effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed bottom-4 right-4 z-[9999] max-w-sm w-full md:w-auto"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-2xl p-4 flex gap-4 relative overflow-hidden group">
          
          {/* Animated Background Glow */}
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors" />

          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/20">
              <Hammer className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 mr-4">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              System Under Construction
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">BETA</span>
            </h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              This environment is actively being developed. New features are deployed daily.
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                <Code2 className="w-3 h-3" />
                <span>Lead Dev: <span className="text-blue-400 font-bold">Koustav</span></span>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DevNotice;
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
             {isDestructive ? <Trash2 className="w-6 h-6 text-red-500" /> : <AlertTriangle className="w-6 h-6 text-orange-500" />}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{message}</p>

          <div className="flex gap-3">
             <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition"
             >
                Cancel
             </button>
             <button 
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition shadow-lg ${
                    isDestructive 
                    ? "bg-red-600 hover:bg-red-500 shadow-red-500/20" 
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                }`}
             >
                {confirmText}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
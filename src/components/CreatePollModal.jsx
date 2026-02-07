import { motion } from "framer-motion";
import { useState } from "react";
import { X, Plus, Trash, BarChart2 } from "lucide-react";
import useChatStore from "../store/useChatStore";

const CreatePollModal = ({ isOpen, onClose }) => {
  const { createPoll } = useChatStore();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    // Basic validation
    if (!question.trim()) return;
    if (options.some(opt => !opt.trim())) return;

    createPoll(question, options);
    onClose();
    setQuestion("");
    setOptions(["", ""]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" /> Create Poll
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>

        <div className="p-6 space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Question</label>
                <input 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-1"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Options</label>
                {options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                        <input 
                            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                        {options.length > 2 && (
                            <button onClick={() => handleRemoveOption(idx)} className="p-2 text-slate-500 hover:text-red-400">
                                <Trash className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
                {options.length < 5 && (
                    <button onClick={handleAddOption} className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-300">
                        <Plus className="w-4 h-4" /> Add Option
                    </button>
                )}
            </div>

            <button 
                onClick={handleCreate}
                disabled={!question.trim() || options.some(o => !o.trim())}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20"
            >
                Create Poll
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePollModal;
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { X, Type, Image as ImageIcon, Send } from "lucide-react";
import useChatStore from "../store/useChatStore";

const StatusUploadModal = ({ isOpen, onClose }) => {
  const { addStory } = useChatStore();
  const [mode, setMode] = useState("text"); // 'text' or 'image'
  const [text, setText] = useState("");
  const [color, setColor] = useState("bg-purple-600");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const colors = ["bg-purple-600", "bg-blue-600", "bg-red-500", "bg-green-500", "bg-slate-800"];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setMode("image");
    }
  };

  const handlePost = () => {
    if (mode === "text" && text.trim()) {
      addStory("text", text, color);
    } else if (mode === "image" && image) {
      addStory("image", image);
    }
    onClose();
    setText("");
    setImage(null);
    setMode("text");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-white font-bold">New Status</h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
        </div>

        {/* Canvas */}
        <div className={`h-80 w-full flex items-center justify-center relative ${mode === 'text' ? color : 'bg-black'}`}>
            {mode === 'text' ? (
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a status..."
                    className="w-full h-full bg-transparent text-white text-2xl font-bold text-center p-8 resize-none focus:outline-none placeholder:text-white/50"
                />
            ) : (
                <img src={image} className="w-full h-full object-contain" />
            )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-900 space-y-4">
            {/* Mode Switcher */}
            <div className="flex justify-center gap-4">
                <button onClick={() => setMode("text")} className={`p-2 rounded-full ${mode === 'text' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                    <Type className="w-5 h-5" />
                </button>
                <button onClick={() => fileInputRef.current.click()} className={`p-2 rounded-full ${mode === 'image' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400'}`}>
                    <ImageIcon className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
            </div>

            {/* Color Picker (Text Mode) */}
            {mode === 'text' && (
                <div className="flex justify-center gap-2">
                    {colors.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setColor(c)} 
                            className={`w-6 h-6 rounded-full ${c} border-2 ${color === c ? 'border-white' : 'border-transparent'}`} 
                        />
                    ))}
                </div>
            )}

            <button 
                onClick={handlePost}
                disabled={(mode === 'text' && !text) || (mode === 'image' && !image)}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
                <Send className="w-4 h-4" /> Share to Status
            </button>
        </div>

      </motion.div>
    </div>
  );
};

export default StatusUploadModal;
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Camera, User, FileText, Check, Save } from "lucide-react";
import useChatStore from "../store/useChatStore";
import toast from "react-hot-toast";

const SettingsModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useChatStore();
  const fileInputRef = useRef(null);

  // Local state for editing
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Load current data when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name);
      setBio(currentUser.bio || "");
      setAvatar(currentUser.avatar);
    }
  }, [isOpen, currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    updateProfile(name, bio, avatar);
    
    toast.success("Profile updated successfully!", {
        icon: '✨',
        style: {
          background: '#1e293b',
          color: '#fff',
        },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
                <div 
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                        <img 
                            src={avatar} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2">Tap to change photo</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                            placeholder="Your Name"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bio / Status</label>
                    <div className="relative group">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 resize-none h-24"
                            placeholder="Write something about yourself..."
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button 
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" />
                Save Changes
            </button>
        </div>

      </motion.div>
    </div>
  );
};

export default SettingsModal;
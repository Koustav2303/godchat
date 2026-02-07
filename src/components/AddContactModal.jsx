import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, UserPlus, Phone, User } from "lucide-react";
import useChatStore from "../store/useChatStore";

const AddContactModal = ({ isOpen, onClose }) => {
  const { addContact } = useChatStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;
    addContact(name, phone);
    onClose();
    setName("");
    setPhone("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <UserPlus className="w-6 h-6 text-blue-500" /> Add Contact
             </h2>
             <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-4">
             <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
             </div>
             <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
             </div>
          </div>

          <button 
             onClick={handleAdd}
             disabled={!name || !phone}
             className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
             Save Contact
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddContactModal;
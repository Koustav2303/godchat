import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { X, Camera, Check, Search, Users, Plus, AlertCircle } from "lucide-react";
import useChatStore from "../store/useChatStore";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { createGroup, chats } = useChatStore();
  
  // State for the form
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const fileInputRef = useRef(null);

  // Suggested contacts (Filter out existing groups, only show people)
  const availableContacts = chats.filter(c => !c.isGroup);
  
  // Filter based on search
  const filteredContacts = availableContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(URL.createObjectURL(file));
    }
  };

  const toggleMember = (contact) => {
    if (selectedMembers.find(m => m.id === contact.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== contact.id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const handleCreate = () => {
    if (!groupName || selectedMembers.length < 3) return;
    createGroup(groupName, groupImage, selectedMembers);
    onClose();
    // Reset state
    setGroupName("");
    setGroupImage(null);
    setSelectedMembers([]);
  };

  const remaining = 3 - selectedMembers.length;

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
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Create New Group
            </h2>
            <p className="text-xs text-slate-400 mt-1">Start a conversation with your community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Group Info */}
          <div className="flex items-center gap-6">
            {/* Image Upload */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600 group-hover:border-blue-500 overflow-hidden transition-colors ${groupImage ? 'bg-black' : 'bg-slate-800'}`}>
                {groupImage ? (
                  <img src={groupImage} alt="Group" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <Plus className="w-6 h-6 text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            {/* Name Input */}
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Group Name</label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Project Avengers"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="border-t border-slate-800" />

          {/* Section 2: Members */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Members</label>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${remaining <= 0 ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                {remaining <= 0 ? "Ready to create" : `Add ${remaining} more`}
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            {/* Contact List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {filteredContacts.map(contact => {
                const isSelected = selectedMembers.find(m => m.id === contact.id);
                return (
                  <div 
                    key={contact.id} 
                    onClick={() => toggleMember(contact)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${isSelected ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-800/30 border-transparent hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.status}</p>
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                );
              })}
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No contacts found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
            {remaining > 0 ? (
                 <div className="flex items-center gap-2 text-orange-400 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Select at least 3 members</span>
                 </div>
            ) : (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Check className="w-4 h-4" />
                    <span>Requirement met</span>
                 </div>
            )}

            <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition">Cancel</button>
                <button 
                    onClick={handleCreate}
                    disabled={!groupName || remaining > 0}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                    Create Group
                </button>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default CreateGroupModal;
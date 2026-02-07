import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Send, ChevronLeft, ChevronRight } from "lucide-react";
import useChatStore from "../store/useChatStore";

const StoryViewerModal = ({ isOpen, onClose, userId }) => {
  const { chats, myStories, currentUser, replyToStory, viewStory } = useChatStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replyText, setReplyText] = useState("");

  // Determine whose stories to show
  const isMe = userId === "me";
  const stories = isMe ? myStories : chats.find(c => c.id === userId)?.stories || [];
  const user = isMe ? currentUser : chats.find(c => c.id === userId);

  const currentStory = stories[currentIndex];

  // Auto-advance
  useEffect(() => {
    if (!isOpen || !currentStory) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000); // 5 seconds per story

    return () => clearTimeout(timer);
  }, [currentIndex, isOpen, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    replyToStory(userId, currentStory.content, replyText);
    onClose();
    setReplyText("");
  };

  if (!isOpen || stories.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md h-full md:h-[90vh] bg-gray-900 md:rounded-2xl overflow-hidden flex flex-col"
      >
        
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {stories.map((s, idx) => (
                <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: idx < currentIndex ? "100%" : "0%" }}
                        animate={{ width: idx === currentIndex ? "100%" : (idx < currentIndex ? "100%" : "0%") }}
                        transition={{ duration: idx === currentIndex ? 5 : 0, ease: "linear" }}
                        className="h-full bg-white"
                    />
                </div>
            ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 mt-2">
            <div className="flex items-center gap-2">
                <img src={user?.avatar} className="w-8 h-8 rounded-full border border-white/50" />
                <div>
                    <p className="text-white text-sm font-bold shadow-black drop-shadow-md">{user?.name}</p>
                    <p className="text-white/70 text-xs shadow-black drop-shadow-md">{currentStory.time}</p>
                </div>
            </div>
            <button onClick={onClose}><X className="w-6 h-6 text-white drop-shadow-md" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center" onClick={handleNext}>
             {/* Touch Areas for Navigation */}
             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
             <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }} />

            {currentStory.type === 'image' && (
                <img src={currentStory.content} className="w-full h-full object-cover" />
            )}
            {currentStory.type === 'text' && (
                <div className={`w-full h-full flex items-center justify-center p-8 text-center ${currentStory.background || 'bg-blue-600'}`}>
                    <p className="text-white text-2xl md:text-3xl font-bold font-serif leading-relaxed">
                        {currentStory.content}
                    </p>
                </div>
            )}
             {currentStory.type === 'video' && (
                <video src={currentStory.content} autoPlay className="w-full h-full object-cover" />
            )}
        </div>

        {/* Footer: Reply (Only if not me) */}
        {!isMe && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                <form onSubmit={handleReply} className="flex gap-2">
                    <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to story..." 
                        className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-3 text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-black/40 backdrop-blur-sm"
                    />
                    <button type="submit" className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition">
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        )}
         {isMe && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 flex justify-center">
                 <div className="flex items-center gap-2 text-white/80">
                    <p className="text-sm">👁️ 24 views</p>
                 </div>
            </div>
         )}
      </motion.div>
    </div>
  );
};

export default StoryViewerModal;
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User } from "lucide-react";
import useChatStore from "../store/useChatStore";

const CallOverlay = () => {
  const { isCallActive, callType, callStatus, endCall, acceptCall, chats, activeChatId } = useChatStore();
  
  // Local Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [duration, setDuration] = useState(0);

  // Get User Data
  const activeChat = chats.find(c => c.id === activeChatId);

  // 1. Simulate "Ringing" -> "Connected" logic
  useEffect(() => {
    if (isCallActive && callStatus === 'ringing') {
      const timer = setTimeout(() => {
        acceptCall(); // Auto-answer after 3 seconds
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isCallActive, callStatus]);

  // 2. Call Timer Logic
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!isCallActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full h-full md:w-[400px] md:h-[700px] md:bg-slate-900 md:rounded-3xl md:border md:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col"
      >
        
        {/* BACKGROUND DECORATION */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/20 to-transparent" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-40 right-[-50px] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-8">
            
            {/* AVATAR / VIDEO AREA */}
            <div className="relative">
                {/* Pulse Animation when ringing */}
                {callStatus === 'ringing' && (
                    <>
                    <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
                    />
                    </>
                )}
                
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl relative z-10 bg-slate-800">
                    <img src={activeChat?.avatar} alt="Caller" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* NAME & STATUS */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{activeChat?.name}</h2>
                <p className={`text-sm font-medium tracking-wide ${callStatus === 'connected' ? 'text-green-400' : 'text-slate-400 animate-pulse'}`}>
                    {callStatus === 'ringing' ? 'Calling...' : 
                     callStatus === 'connected' ? formatTime(duration) : 
                     'Connecting...'}
                </p>
            </div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="p-8 pb-12 z-10">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-4 flex justify-between items-center shadow-lg border border-white/5">
                
                {/* MUTE */}
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-black' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                {/* VIDEO TOGGLE (If video call) */}
                <button 
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-4 rounded-full transition-all ${!isVideoOn ? 'bg-white text-black' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                    {!isVideoOn ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
                
                 {/* SPEAKER */}
                 <button 
                    className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all"
                >
                    <Volume2 className="w-6 h-6" />
                </button>

                {/* END CALL */}
                <button 
                    onClick={() => { setDuration(0); endCall(); }}
                    className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default CallOverlay;
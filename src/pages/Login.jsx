import { useState } from "react";
import { MessageSquare, ArrowRight, Lock, Mail, Sparkles, Fingerprint } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useChatStore();
  
  // 1. INITIALIZE WITH EMPTY STRINGS
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);

    // Simulate Server Delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Extract username from email (e.g., "john" from "john@example.com")
      const username = email.split('@')[0];
      const displayName = username.charAt(0).toUpperCase() + username.slice(1);

      // Log the user in
      login({ 
        id: "me", 
        name: displayName, 
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`
      });

      toast.success(`Welcome back, ${displayName}.`, {
        icon: '👋',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });

    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10"
      >
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white text-center tracking-tight">GodChat</h2>
          <p className="text-slate-400 text-center mt-2 text-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> 
            Secure Login Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-white/10 bg-white/5 rounded-l-xl">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="email"
                    name="email_field_random_id" // Random name to trick autocomplete
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-16 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-slate-800/80 transition-all font-medium"
                    autoComplete="new-password" // Trick to disable autocomplete
                />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Password</label>
             <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-white/10 bg-white/5 rounded-l-xl">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="password"
                    name="password_field_random_id"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-16 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-slate-800/80 transition-all font-medium"
                    autoComplete="new-password"
                />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-4 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
               <span className="flex items-center gap-2">
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Authenticating...
               </span>
            ) : (
              <>
                Enter System
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-600 font-mono">
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                STATUS: SECURE
            </span>
            <span className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3" /> v2.5.0
            </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
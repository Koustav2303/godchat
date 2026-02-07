import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import useChatStore from "../store/useChatStore";

const PollCard = ({ message, chatId }) => {
  const { votePoll } = useChatStore();
  const totalVotes = message.options.reduce((acc, opt) => acc + opt.votes.length, 0);

  const handleVote = (optionId) => {
    votePoll(chatId, message.id, optionId);
  };

  return (
    <div className="w-full min-w-[280px] sm:min-w-[320px] bg-slate-800/80 rounded-xl p-4 border border-slate-700 shadow-sm">
      <h3 className="text-white font-bold text-lg mb-4">{message.question}</h3>
      
      <div className="space-y-3">
        {message.options.map((option) => {
          const isVoted = option.votes.includes("me");
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);

          return (
            <div 
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="relative cursor-pointer group"
            >
                {/* Progress Bar Background */}
                <div className="absolute inset-0 bg-slate-700/50 rounded-lg overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full opacity-20 ${isVoted ? 'bg-blue-400' : 'bg-slate-400'}`}
                    />
                </div>

                {/* Content */}
                <div className={`relative flex items-center justify-between p-3 rounded-lg border transition-colors ${isVoted ? 'border-blue-500/50' : 'border-transparent group-hover:border-slate-600'}`}>
                    <div className="flex items-center gap-3">
                        {isVoted ? <CheckCircle2 className="w-5 h-5 text-blue-400" /> : <Circle className="w-5 h-5 text-slate-500" />}
                        <span className="text-slate-200 font-medium text-sm">{option.text}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{percentage}%</span>
                </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-slate-500 font-medium px-1">
         <span>{totalVotes} votes</span>
         <span>{message.time}</span>
      </div>
    </div>
  );
};

export default PollCard;
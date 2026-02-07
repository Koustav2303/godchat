import { Plus, CircleDashed } from "lucide-react";
import useChatStore from "../store/useChatStore";

const StatusList = ({ onOpenUpload, onOpenViewer }) => {
  const { chats, currentUser, myStories } = useChatStore();

  const hasMyStory = myStories && myStories.length > 0;
  
  // Filter chats that have stories
  const recentUpdates = chats.filter(c => c.stories?.length > 0 && !c.stories.every(s => s.viewed));
  const viewedUpdates = chats.filter(c => c.stories?.length > 0 && c.stories.every(s => s.viewed));

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
      
      {/* MY STATUS */}
      <div className="p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">My Status</h3>
        <div 
            onClick={() => hasMyStory ? onOpenViewer("me") : onOpenUpload()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
             <div className="relative">
                 <div className={`w-12 h-12 rounded-full p-[2px] ${hasMyStory ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : 'bg-transparent border-2 border-slate-700 border-dashed'}`}>
                     <img src={currentUser?.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                 </div>
                 {!hasMyStory && (
                     <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-0.5 border-2 border-slate-900">
                         <Plus className="w-3 h-3 text-white" />
                     </div>
                 )}
             </div>
             <div className="flex-1">
                 <p className="font-semibold text-white text-sm">My Status</p>
                 <p className="text-xs text-slate-500">
                    {hasMyStory ? "Tap to view updates" : "Tap to add status update"}
                 </p>
             </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mx-4" />

      {/* RECENT UPDATES */}
      <div className="p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Updates</h3>
        
        {recentUpdates.length === 0 && (
            <p className="text-xs text-slate-600 italic">No new updates</p>
        )}

        <div className="space-y-1">
            {recentUpdates.map(chat => (
                <div 
                    key={chat.id}
                    onClick={() => onOpenViewer(chat.id)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-green-400">
                        <img src={chat.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm">{chat.name}</p>
                        <p className="text-xs text-blue-400 font-medium">
                            {chat.stories[chat.stories.length - 1].time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* VIEWED UPDATES */}
      {viewedUpdates.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Viewed Updates</h3>
            <div className="space-y-1">
                {viewedUpdates.map(chat => (
                    <div 
                        key={chat.id}
                        onClick={() => onOpenViewer(chat.id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer opacity-60"
                    >
                        <div className="w-12 h-12 rounded-full p-[2px] bg-slate-600">
                            <img src={chat.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">{chat.name}</p>
                            <p className="text-xs text-slate-500">
                                {chat.stories[chat.stories.length - 1].time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default StatusList;
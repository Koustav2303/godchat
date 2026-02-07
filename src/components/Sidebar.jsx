import { Settings, MessageSquare, LogOut, Plus, Users, UserPlus, CircleDashed, MessageCircle, Pin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useChatStore from "../store/useChatStore";
import CreateGroupModal from "./CreateGroupModal";
import AddContactModal from "./AddContactModal";
import SettingsModal from "./SettingsModal";
import StatusUploadModal from "./StatusUploadModal";
import StoryViewerModal from "./StoryViewerModal";
import StatusList from "./StatusList";
import ChatContextMenu from "./ChatContextMenu";
import ConfirmModal from "./ConfirmModal"; // <--- NEW IMPORT
import toast from "react-hot-toast";

const Sidebar = () => {
  const { chats, activeChatId, setActiveChat, logout, deleteChat, togglePin } = useChatStore();
  const [activeTab, setActiveTab] = useState("chats");

  // Modals
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isStatusUploadOpen, setIsStatusUploadOpen] = useState(false);
  const [viewingStoryId, setViewingStoryId] = useState(null);
  
  // Context Menu & Confirmation
  const [contextMenu, setContextMenu] = useState(null); // { x, y, chat }
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID of chat to delete
  const longPressTimer = useRef(null);

  // Sorting: Pinned first
  const pinnedChats = chats.filter(c => c.pinned);
  const otherChats = chats.filter(c => !c.pinned);

  // --- HANDLERS ---
  const handleContextMenu = (e, chat) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, chat });
  };

  const handleTouchStart = (e, chat) => {
    longPressTimer.current = setTimeout(() => {
        setContextMenu({ 
            x: window.innerWidth / 2 - 104, 
            y: e.touches[0].clientY, 
            chat 
        });
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const requestDelete = () => {
    if (contextMenu) {
        setConfirmDeleteId(contextMenu.chat.id);
        setContextMenu(null);
    }
  };

  const handlePin = () => {
    if (contextMenu) {
        const success = togglePin(contextMenu.chat.id);
        if (!success) {
            toast.error("You can only pin up to 3 chats!", { icon: '📌' });
        }
        setContextMenu(null);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
        deleteChat(confirmDeleteId);
        setConfirmDeleteId(null);
        toast.success("Chat deleted");
    }
  };

  useEffect(() => {
    const handleScroll = () => setContextMenu(null);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- RENDER CHAT ITEM HELPER ---
  const ChatItem = ({ chat }) => (
    <div 
        key={chat.id}
        onClick={() => setActiveChat(chat.id)}
        onContextMenu={(e) => handleContextMenu(e, chat)}
        onTouchStart={(e) => handleTouchStart(e, chat)}
        onTouchEnd={handleTouchEnd}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent select-none relative
        ${activeChatId === chat.id ? "bg-blue-600/10 border-blue-500/30 shadow-md" : "hover:bg-slate-800 border-transparent"}`}
    >
        <div className="relative flex-shrink-0">
            <img src={chat.avatar} alt={chat.name} className={`w-12 h-12 rounded-full object-cover ring-2 ${activeChatId === chat.id ? 'ring-blue-500/50' : 'ring-slate-800'}`} />
            {!chat.isGroup && <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-slate-900 rounded-full ${chat.status === 'online' ? 'bg-green-500' : chat.status === 'busy' ? 'bg-red-500' : 'bg-slate-500'}`} />}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <p className={`font-semibold text-sm truncate flex items-center gap-1.5 ${activeChatId === chat.id ? "text-white" : "text-slate-200"}`}>
                {chat.isGroup && <Users className="w-3.5 h-3.5 text-slate-500" />}
                {chat.name}
                </p>
                {/* Pin Icon or Unread Badge */}
                <div className="flex items-center gap-1">
                    {chat.pinned && <Pin className="w-3 h-3 text-slate-400 rotate-45" />}
                    {chat.unreadCount > 0 && <span className="bg-blue-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold shadow-sm shadow-blue-500/50">{chat.unreadCount}</span>}
                </div>
            </div>
            <p className={`text-sm truncate leading-snug ${activeChatId === chat.id ? "text-blue-200/80" : "text-slate-500"}`}>
                <span className={chat.unreadCount > 0 ? "font-medium text-slate-300" : ""}>{chat.lastMessage}</span>
            </p>
        </div>
    </div>
  );

  return (
    <>
    <aside className="w-full md:w-80 h-full bg-slate-900 flex flex-col transition-all duration-300 border-r border-slate-800 relative" onContextMenu={(e) => e.preventDefault()}>
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">GodChat</span>
        </div>
        
        {activeTab === 'chats' && (
            <div className="flex gap-1">
                <button onClick={() => setIsContactModalOpen(true)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><UserPlus className="w-5 h-5" /></button>
                <button onClick={() => setIsGroupModalOpen(true)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><Plus className="w-5 h-5" /></button>
            </div>
        )}
         {activeTab === 'status' && (
             <div className="flex gap-1">
                 <button onClick={() => setIsStatusUploadOpen(true)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><Plus className="w-5 h-5" /></button>
             </div>
         )}
      </div>

      {activeTab === 'chats' ? (
          <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            
            {/* PINNED CHATS SECTION */}
            {pinnedChats.length > 0 && (
                <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 bg-slate-900 z-10">
                        <Pin className="w-3 h-3" /> Pinned
                    </div>
                    <div className="space-y-1 px-2">
                        {pinnedChats.map(chat => <ChatItem key={chat.id} chat={chat} />)}
                    </div>
                    <div className="border-b border-slate-800 my-2 mx-4" />
                </div>
            )}

            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center bg-slate-900 z-10">
              <span>All Chats</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">{otherChats.length}</span>
            </div>
            
            <div className="space-y-1 px-2 pb-20">
                {otherChats.map(chat => <ChatItem key={chat.id} chat={chat} />)}
            </div>
          </nav>
      ) : (
          <StatusList onOpenUpload={() => setIsStatusUploadOpen(true)} onOpenViewer={(id) => setViewingStoryId(id)} />
      )}

      <ChatContextMenu 
        position={contextMenu} 
        chat={contextMenu?.chat}
        onClose={() => setContextMenu(null)} 
        onDelete={requestDelete} 
        onPin={handlePin}
      />

      <div className="h-16 border-t border-slate-800 bg-slate-900 grid grid-cols-3 items-center absolute bottom-0 w-full">
          <button onClick={() => setActiveTab("chats")} className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${activeTab === 'chats' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>
              <MessageCircle className={`w-6 h-6 ${activeTab === 'chats' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-bold">Chats</span>
          </button>
          <button onClick={() => setActiveTab("status")} className={`flex flex-col items-center justify-center gap-1 h-full transition-colors relative ${activeTab === 'status' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>
              <CircleDashed className={`w-6 h-6 ${activeTab === 'status' ? 'animate-spin-slow' : ''}`} />
              <span className="text-[10px] font-bold">Updates</span>
              <span className="absolute top-3 right-8 w-2 h-2 bg-green-500 rounded-full border border-slate-900"></span>
          </button>
          <button onClick={() => setIsSettingsModalOpen(true)} className={`flex flex-col items-center justify-center gap-1 h-full transition-colors text-slate-500 hover:text-slate-300`}>
              <Settings className="w-6 h-6" />
              <span className="text-[10px] font-bold">Settings</span>
          </button>
      </div>
    </aside>

    {/* Global Modals */}
    <ConfirmModal 
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this chat? This action cannot be undone and you will lose all message history."
        confirmText="Delete Chat"
        isDestructive={true}
    />

    <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    <AddContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    <StatusUploadModal isOpen={isStatusUploadOpen} onClose={() => setIsStatusUploadOpen(false)} />
    <StoryViewerModal isOpen={!!viewingStoryId} userId={viewingStoryId} onClose={() => setViewingStoryId(null)} />
    </>
  );
};

export default Sidebar;
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Phone, Video, Paperclip, Search, X, Info, Reply, XCircle, Users, Shield, ShieldAlert, UserPlus, Trash2, ChevronLeft, Check, X as CancelIcon, BarChart2, Sparkles } from "lucide-react";
import useChatStore from "../store/useChatStore";
import MessageContextMenu from "./MessageContextMenu";
import PollCard from "./PollCard";
import CreatePollModal from "./CreatePollModal";
import SummaryModal from "./SummaryModal"; // <--- NEW IMPORT

const ChatArea = () => {
  const { 
    chats, activeChatId, setActiveChat, sendMessage, isTyping, typingUser, theme, 
    addReaction, addMember, updateRole, clearChat, startCall, editMessage, deleteMessage,
    generateSummary // <--- New Action
  } = useChatStore();
  
  const [input, setInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  
  // Modals
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const [msgContextMenu, setMsgContextMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const longPressTimer = useRef(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];
  
  const myRole = activeChat?.isGroup ? activeChat.members.find(m => m.id === "me")?.role : null;
  const isAdminOrMod = myRole === "admin" || myRole === "moderator";
  const sharedMedia = messages.filter(msg => msg.image).map(msg => msg.image);

  const scrollToBottom = () => {
    if (!isSearchOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages, isTyping, activeChatId]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, null, replyingTo);
    setInput("");
    setReplyingTo(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendMessage("", URL.createObjectURL(file), replyingTo);
      setReplyingTo(null);
    }
  };

  const handleAddMember = () => {
    if (newMemberName && newMemberPhone) {
        addMember(activeChat.id, newMemberName, newMemberPhone);
        setNewMemberName(""); setNewMemberPhone("");
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear conversation? This cannot be undone.")) clearChat(activeChat.id);
  };

  const handleContextMenu = (e, msg) => {
    e.preventDefault();
    setMsgContextMenu({ x: e.clientX, y: e.clientY, message: msg });
  };

  const handleTouchStart = (e, msg) => {
    longPressTimer.current = setTimeout(() => {
        setMsgContextMenu({ x: Math.min(window.innerWidth - 170, e.touches[0].clientX), y: e.touches[0].clientY, message: msg });
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const startEditing = () => {
    if (msgContextMenu) {
        setEditingMessageId(msgContextMenu.message.id);
        setEditInput(msgContextMenu.message.text);
        setMsgContextMenu(null);
    }
  };

  const saveEdit = (msgId) => {
    if (editInput.trim()) {
        editMessage(activeChat.id, msgId, editInput);
        setEditingMessageId(null);
        setEditInput("");
    }
  };

  const handleDeleteMessage = () => {
    if (msgContextMenu && window.confirm("Delete this message?")) {
        deleteMessage(activeChat.id, msgContextMenu.message.id);
        setMsgContextMenu(null);
    }
  };

  const getThemeBackground = () => {
    switch(theme) {
      case "cyberpunk": return "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black";
      case "midnight": return "bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950";
      case "sunset": return "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900";
      default: return "bg-slate-950";
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span>{parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className="bg-yellow-500/50 text-white px-0.5 rounded-sm font-bold">{part}</span> : part)}</span>;
  };

  if (!activeChat) return <div className={`flex-1 flex items-center justify-center text-slate-500 ${getThemeBackground()}`}>Select a chat</div>;

  return (
    <div className="flex flex-1 overflow-hidden relative h-full">
      <main className={`flex-1 flex flex-col relative transition-all duration-500 ${getThemeBackground()}`}>
        
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-slate-900/60 backdrop-blur-md z-10 sticky top-0">
          {!isSearchOpen ? (
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"><ChevronLeft className="w-6 h-6" /></button>
              <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
                <div className="relative flex-shrink-0">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
                  {!activeChat.isGroup && <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-slate-900 rounded-full ${activeChat.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`} />}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-semibold text-white text-sm truncate flex items-center gap-2">
                      {activeChat.name}
                      {activeChat.isGroup && <span className="bg-slate-700 text-[9px] px-1 py-0.5 rounded text-slate-300 tracking-wide">GROUP</span>}
                  </h2>
                  <p className="text-xs text-slate-400 capitalize truncate">{activeChat.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-slate-400">
                {/* AI SUMMARY BUTTON */}
                <button 
                    onClick={generateSummary} 
                    className="p-2 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 text-purple-300 hover:text-white rounded-full transition border border-purple-500/30 hover:border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]" 
                    title="Generate AI Summary"
                >
                    <Sparkles className="w-5 h-5" />
                </button>

                <button onClick={() => startCall('voice')} className="p-2 hover:bg-white/10 rounded-full transition"><Phone className="w-5 h-5" /></button>
                <button onClick={() => startCall('video')} className="p-2 hover:bg-white/10 rounded-full transition"><Video className="w-5 h-5" /></button>
                <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition"><Search className="w-5 h-5" /></button>
                <button onClick={handleClearChat} className="p-2 hover:bg-white/10 rounded-full transition text-red-400/80 hover:text-red-400 hidden sm:block"><Trash2 className="w-5 h-5" /></button>
                <button onClick={() => setShowProfile(!showProfile)} className="p-2 hover:bg-white/10 rounded-full transition"><Info className={`w-5 h-5 ${showProfile ? 'text-blue-400' : ''}`} /></button>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center w-full gap-3">
              <div className="flex-1 flex items-center bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-500 mr-2" />
                <input autoFocus type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full" />
              </div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </motion.div>
          )}
        </header>

        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex w-full group ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                 {msg.isSystem ? (
                    <div className="w-full flex justify-center my-2"><span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800/40 text-slate-500 px-3 py-1 rounded-full border border-white/5">{msg.text}</span></div>
                 ) : (
                    <>
                    {msg.type === 'poll' ? (
                        <div className="max-w-[85%] sm:max-w-md">
                            <PollCard message={msg} chatId={activeChat.id} />
                        </div>
                    ) : (
                        <div 
                            onContextMenu={(e) => handleContextMenu(e, msg)}
                            onTouchStart={(e) => handleTouchStart(e, msg)}
                            onTouchEnd={handleTouchEnd}
                            className={`max-w-[85%] sm:max-w-xl px-4 py-3 rounded-2xl shadow-sm flex flex-col gap-1 backdrop-blur-sm relative border select-none 
                            ${msg.isMe ? "bg-blue-600/90 text-white rounded-tr-none border-blue-500/50" : "bg-slate-800/90 text-slate-200 rounded-tl-none border-white/10"}
                            ${msg.isDeleted ? "opacity-60 italic" : ""}`}
                        >
                            {activeChat.isGroup && !msg.isMe && <span className={`text-[10px] font-bold opacity-70 mb-0.5 ${msg.senderId === 1 ? 'text-pink-400' : 'text-orange-400'}`}>{activeChat.members.find(m => m.id === msg.senderId)?.name || "Unknown"}</span>}
                            {msg.replyTo && <div className={`text-xs mb-1 px-2 py-1 rounded border-l-2 opacity-80 ${msg.isMe ? "bg-blue-800/50 border-blue-300" : "bg-slate-900/50 border-slate-500"}`}><span className="font-bold block mb-0.5">Reply</span><span className="line-clamp-1">{msg.replyTo.text || "Attachment"}</span></div>}
                            {msg.image && <img src={msg.image} className="rounded-lg max-w-full h-auto object-cover border border-white/10" />}
                            {editingMessageId === msg.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input className="bg-black/20 text-white rounded px-2 py-1 text-sm w-full focus:outline-none" value={editInput} onChange={(e) => setEditInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(msg.id)} />
                                    <button onClick={() => saveEdit(msg.id)} className="p-1 bg-green-500/20 text-green-300 rounded"><Check className="w-3 h-3" /></button>
                                    <button onClick={() => setEditingMessageId(null)} className="p-1 bg-red-500/20 text-red-300 rounded"><CancelIcon className="w-3 h-3" /></button>
                                </div>
                            ) : (
                                msg.text && <p className="leading-relaxed text-sm md:text-base break-words whitespace-pre-wrap">{isSearchOpen && searchQuery ? highlightText(msg.text, searchQuery) : msg.text}</p>
                            )}
                            <div className="flex items-center justify-between gap-3 mt-1 min-h-[16px]">
                                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                    <div className="flex gap-1 -mb-5 bg-slate-900/90 border border-white/10 rounded-full px-2 py-0.5 shadow-lg z-10">
                                        {Object.entries(msg.reactions).map(([emoji, count]) => <span key={emoji} className="text-[10px]">{emoji} {count > 1 && count}</span>)}
                                    </div>
                                )}
                                <div className={`text-[9px] ml-auto font-medium flex gap-1 items-center ${msg.isMe ? "text-blue-200/70" : "text-slate-500"}`}>
                                    {msg.isEdited && !msg.isDeleted && <span>(edited)</span>}
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    )}
                    {!msg.isMe && !msg.isDeleted && msg.type !== 'poll' && (
                         <div className="flex flex-col gap-1 justify-end ml-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                             <button onClick={() => addReaction(msg.id, '❤️')} className="p-1 hover:bg-white/5 rounded-full text-[10px]">❤️</button>
                             <button onClick={() => setReplyingTo(msg)} className="p-1 hover:bg-white/5 rounded-full text-slate-500"><Reply className="w-3 h-3" /></button>
                         </div>
                    )}
                    </>
                 )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        <MessageContextMenu position={msgContextMenu} message={msgContextMenu?.message} onClose={() => setMsgContextMenu(null)} onEdit={startEditing} onDelete={handleDeleteMessage} onReaction={(emoji) => { addReaction(msgContextMenu.message.id, emoji); setMsgContextMenu(null); }} />

        {/* INPUT AREA */}
        <div className="p-3 md:p-4 border-t border-white/10 bg-slate-900/60 backdrop-blur-lg mb-safe">
          {replyingTo && (
            <div className="flex items-center justify-between bg-slate-800/80 p-2 px-4 rounded-t-xl border-b border-white/5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Reply className="w-3 h-3 text-blue-400" />
                  <div><span className="font-bold text-blue-400">Replying...</span> <span className="opacity-70 line-clamp-1">{replyingTo.text}</span></div>
                </div>
                <button onClick={() => setReplyingTo(null)}><XCircle className="w-4 h-4 text-slate-500" /></button>
            </div>
          )}
          <div className={`flex items-center gap-2 bg-slate-800/50 p-2 border border-slate-700/50 transition-all shadow-lg backdrop-blur-md ${replyingTo ? 'rounded-b-xl rounded-t-none' : 'rounded-2xl'}`}>
              <button onClick={() => setIsPollModalOpen(true)} className="p-2 text-slate-400 hover:text-white" title="Create Poll"><BarChart2 className="w-5 h-5" /></button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-white"><Paperclip className="w-5 h-5" /></button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Message..." className="flex-1 bg-transparent text-white text-sm px-2 py-1 focus:outline-none" />
              <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20"><Send className="w-4 h-4" /></button>
          </div>
        </div>

        <CreatePollModal isOpen={isPollModalOpen} onClose={() => setIsPollModalOpen(false)} />
        <SummaryModal /> {/* <--- RENDER THE SUMMARY MODAL */}
      </main>

      <AnimatePresence>
          {showProfile && (
              <motion.aside 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-y-0 right-0 w-full sm:w-80 bg-slate-900 border-l border-white/10 h-full overflow-y-auto shadow-2xl z-30"
              >
                  <div className="absolute top-4 right-4 z-40 md:hidden"><button onClick={() => setShowProfile(false)} className="p-2 bg-black/20 rounded-full text-white"><X className="w-6 h-6"/></button></div>
                   <div className="p-6 flex flex-col items-center border-b border-white/10 mt-8">
                      <img src={activeChat.avatar} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-slate-800" />
                      <h2 className="text-xl font-bold text-white text-center">{activeChat.name}</h2>
                      <p className="text-slate-400 text-sm mt-1">{activeChat.isGroup ? `${activeChat.members.length} Members` : activeChat.phone}</p>
                  </div>
                  {activeChat.isGroup && (
                      <div className="p-4 border-b border-white/10">
                          {isAdminOrMod && (
                              <div className="bg-slate-800/50 p-3 rounded-xl mb-4 border border-white/5">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><UserPlus className="w-3 h-3" /> Add Member</h3>
                                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white mb-2" placeholder="Name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
                                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white mb-2" placeholder="Phone Number" value={newMemberPhone} onChange={(e) => setNewMemberPhone(e.target.value)} />
                                  <button onClick={handleAddMember} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-1.5 rounded transition">Add User</button>
                              </div>
                          )}
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Members</h3>
                          <div className="space-y-3">
                              {activeChat.members.map((member) => (
                                  <div key={member.id} className="flex flex-col bg-slate-800/30 p-2 rounded-lg">
                                      <div className="flex items-center gap-3">
                                          <img src={member.avatar} className="w-8 h-8 rounded-full" />
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-white truncate flex items-center gap-1">
                                                  {member.name}
                                                  {member.role === 'admin' && <ShieldAlert className="w-3 h-3 text-red-400" />}
                                                  {member.role === 'moderator' && <Shield className="w-3 h-3 text-blue-400" />}
                                              </p>
                                              <p className="text-[10px] text-slate-500 uppercase">{member.role}</p>
                                          </div>
                                      </div>
                                      {myRole === "admin" && member.id !== "me" && (
                                          <div className="flex gap-1 mt-2">
                                              {member.role !== "admin" && ( <button onClick={() => updateRole(activeChat.id, member.id, "admin")} className="flex-1 bg-red-500/10 text-red-400 text-[10px] py-1 rounded hover:bg-red-500/20">Promote Admin</button> )}
                                              {member.role !== "moderator" && ( <button onClick={() => updateRole(activeChat.id, member.id, "moderator")} className="flex-1 bg-blue-500/10 text-blue-400 text-[10px] py-1 rounded hover:bg-blue-500/20">Promote Mod</button> )}
                                              <button onClick={() => updateRole(activeChat.id, member.id, "member")} className="flex-1 bg-slate-700 text-slate-300 text-[10px] py-1 rounded hover:bg-slate-600">Demote</button>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  <div className="p-6">
                      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Shared Media</h3>
                      {sharedMedia.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                              {sharedMedia.map((img, idx) => (
                                  <img key={idx} src={img} className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition" />
                              ))}
                          </div>
                      ) : <p className="text-slate-500 text-sm italic">No media shared yet.</p>}
                  </div>
              </motion.aside>
          )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;
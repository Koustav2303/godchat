import { useEffect, useRef } from "react";
import { Trash2, Pin, PinOff, BellOff, Archive } from "lucide-react";
import useChatStore from "../store/useChatStore";

const ChatContextMenu = ({ position, onClose, onDelete, onPin, chat }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!position || !chat) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-52 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col py-1">
        <button 
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            onClick={onPin}
        >
            {chat.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />} 
            {chat.pinned ? "Unpin Chat" : "Pin Chat"}
        </button>
        <button 
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            onClick={onClose}
        >
            <BellOff className="w-4 h-4" /> Mute Notifications
        </button>
        <div className="border-t border-slate-700 my-1" />
        <button 
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-medium"
            onClick={onDelete}
        >
            <Trash2 className="w-4 h-4" /> Delete Chat
        </button>
      </div>
    </div>
  );
};

export default ChatContextMenu;
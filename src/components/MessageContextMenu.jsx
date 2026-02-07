import { useEffect, useRef } from "react";
import { Trash2, Edit2, Copy, Smile } from "lucide-react";

const MessageContextMenu = ({ position, message, onClose, onEdit, onDelete, onReaction }) => {
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

  if (!position || !message) return null;

  // Only allow edit/delete if it's MY message and not already deleted
  const canEdit = message.isMe && !message.isDeleted;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col py-1">
        {/* REACTION SHORTCUTS (Mobile mostly) */}
        <div className="flex justify-around px-2 py-2 border-b border-slate-700">
            {['❤️','😂','👍','🔥'].map(emoji => (
                <button key={emoji} onClick={() => onReaction(emoji)} className="hover:scale-125 transition text-lg">
                    {emoji}
                </button>
            ))}
        </div>

        <button 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            onClick={() => { navigator.clipboard.writeText(message.text); onClose(); }}
        >
            <Copy className="w-4 h-4" /> Copy
        </button>

        {canEdit && (
            <>
            <button 
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
                onClick={onEdit}
            >
                <Edit2 className="w-4 h-4" /> Edit
            </button>
            <div className="border-t border-slate-700 my-1" />
            <button 
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-medium"
                onClick={onDelete}
            >
                <Trash2 className="w-4 h-4" /> Unsend
            </button>
            </>
        )}
      </div>
    </div>
  );
};

export default MessageContextMenu;
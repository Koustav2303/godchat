import { Command } from "cmdk";
import { useState, useEffect } from "react";
import { Search, LogOut, Moon, Sun, Monitor, Zap, Sunset } from "lucide-react";
import useChatStore from "../store/useChatStore";

const GodCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { chats, setActiveChat, logout, setTheme } = useChatStore();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectChat = (id) => {
    setActiveChat(id);
    setOpen(false);
  };

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <Command label="Global Command Menu" className="w-full">
          
          <div className="flex items-center border-b border-slate-800 px-3" cmdk-input-wrapper="">
            <Search className="w-5 h-5 text-slate-500 mr-2" />
            <Command.Input 
              placeholder="Search chats, themes, or commands..." 
              className="w-full bg-transparent p-4 text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2">
            <Command.Empty className="py-6 text-center text-sm text-slate-500">
              No results found.
            </Command.Empty>

            {/* THEMES GROUP */}
            <Command.Group heading="Themes & Appearance" className="text-xs font-medium text-slate-500 px-2 py-1.5 mb-2">
              <Command.Item onSelect={() => handleThemeChange('default')} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white transition-colors">
                <Moon className="w-4 h-4" />
                <span>Theme: Void (Default)</span>
              </Command.Item>
              <Command.Item onSelect={() => handleThemeChange('cyberpunk')} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white transition-colors">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Theme: Cyberpunk Neon</span>
              </Command.Item>
              <Command.Item onSelect={() => handleThemeChange('midnight')} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white transition-colors">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span>Theme: Midnight Blue</span>
              </Command.Item>
              <Command.Item onSelect={() => handleThemeChange('sunset')} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white transition-colors">
                <Sunset className="w-4 h-4 text-pink-400" />
                <span>Theme: Vaporwave Sunset</span>
              </Command.Item>
            </Command.Group>

            <div className="my-2 border-t border-slate-800" />

            {/* CHATS GROUP */}
            <Command.Group heading="Chats" className="text-xs font-medium text-slate-500 px-2 py-1.5 mb-2">
              {chats.map((chat) => (
                <Command.Item
                  key={chat.id}
                  onSelect={() => handleSelectChat(chat.id)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white transition-colors"
                >
                  <img src={chat.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span>{chat.name}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* SYSTEM GROUP */}
            <Command.Group heading="System" className="text-xs font-medium text-slate-500 px-2 py-1.5 mb-2">
              <Command.Item 
                onSelect={handleLogout}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-red-400 cursor-pointer hover:bg-red-900/20 hover:text-red-300 aria-selected:bg-red-900/20 aria-selected:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </Command.Item>
            </Command.Group>

          </Command.List>

          <div className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500 flex justify-between">
            <span>Select with ↵</span>
            <span>Navigate with ↑↓</span>
          </div>
        </Command>
      </div>
      
      <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
    </div>
  );
};

export default GodCommandPalette;
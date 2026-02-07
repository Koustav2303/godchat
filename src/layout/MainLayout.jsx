import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import useChatStore from "../store/useChatStore";

const MainLayout = () => {
  const { simulateGhostTraffic, activeChatId } = useChatStore();

  // SIMULATION EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        simulateGhostTraffic();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* MOBILE LOGIC:
         - If a chat is active, HIDE the sidebar (unless on desktop).
         - If no chat is active, SHOW the sidebar.
      */}
      <div className={`
        ${activeChatId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-auto h-full flex-col border-r border-slate-800 z-20
      `}>
        <Sidebar />
      </div>

      {/* MOBILE LOGIC:
         - If a chat is active, SHOW the chat area.
         - If no chat is active, HIDE the chat area (unless on desktop).
      */}
      <div className={`
        ${activeChatId ? 'flex' : 'hidden md:flex'} 
        flex-1 h-full relative z-10
      `}>
        <ChatArea />
      </div>
    </div>
  );
};

export default MainLayout;
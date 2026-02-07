import { Toaster } from "react-hot-toast";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import useChatStore from "./store/useChatStore";
import CallOverlay from "./components/CallOverlay";
import DevNotice from "./components/DevNotice"; // <--- NEW IMPORT
import { useEffect } from "react";

function App() {
  const { currentUser, theme } = useChatStore();

  useEffect(() => {
    if (theme === "cyberpunk") {
      document.body.className = "bg-black text-white";
    } else if (theme === "midnight") {
      document.body.className = "bg-slate-950 text-white";
    } else {
      document.body.className = "bg-slate-950 text-white";
    }
  }, [theme]);

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }} 
      />
      
      <CallOverlay />
      <DevNotice /> {/* <--- The Developer Badge */}
      
      {currentUser ? <MainLayout /> : <Login />}
    </>
  );
}

export default App;
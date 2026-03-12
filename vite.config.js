import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // <--- Note the "-swc" at the end

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/godchat/", // Ensure this matches your repo name
})
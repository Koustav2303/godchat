# ⚡ GodChat - Next-Gen Communication Platform

<div align="center">
  <img src="https://img.freepik.com/free-vector/speech-bubble-icon_24911-115292.jpg?semt=ais_rp_progressive&w=740&q=80" alt="GodChat Banner" width="100%" style="border-radius: 15px;" />
  <br/>
  <p><strong>A highly interactive, state-driven chat application simulating top-tier social platforms.</strong></p>
  
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite_7-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
</div>

---

## 🌐 **[Live Demo Available Here](https://Koustav2303.github.io/godchat/)**

---

## 📖 Overview

**GodChat** is a frontend portfolio masterpiece designed to push the limits of React state management and modern UI/UX design. Instead of relying on a heavy backend for demonstration purposes, this application uses a sophisticated, simulated environment managed entirely by **Zustand**. 

It mimics the real-time interactivity of platforms like WhatsApp, Telegram, and Discord, featuring simulated AI participants, dynamic polling, and fluid glassmorphism interfaces.

---

## ✨ Core Features & Technical Highlights

### 🤖 1. Simulated AI & Dynamic Interactivity
* **AI Conversation Summarizer:** Utilizes an asynchronous state sequence to simulate processing delays, followed by a custom typewriter effect hook to stream a context-aware TL;DR of the active chat.
* **Autonomous Poll Voting:** When a user creates a poll in a group, a background engine calculates randomized delays (2s–10s) and automatically dispatches voting actions from simulated group members.
* **Ghost Traffic Engine:** A global `setInterval` simulates incoming messages from inactive chats, updating unread badges and re-ordering the chat list in real-time.

### 💬 2. Advanced Messaging Architecture
* **Message Mutability:** Complete CRUD operations on individual message objects. Users can edit sent messages (flagged with an `(edited)` tag) or unsend them (replaced with a tombstone UI).
* **Quoted Replies:** Complex state linking allows users to select a message, load it into the input context, and attach it as a `replyTo` object in the new message payload.
* **Interactive Poll Components:** Custom-built single-choice polling system with real-time percentage calculations and animated Framer Motion progress bars.

### 🎨 3. High-Fidelity UI/UX (Glassmorphism)
* **Responsive Layout Shifts:** Seamlessly transitions from a dual-pane desktop view to a native-feeling mobile stack with dedicated back-navigation and bottom tab bars.
* **Context Menus:** Replaces native browser alerts with custom, absolutely positioned context menus triggered by `onContextMenu` (desktop) and `onTouchStart/End` timers (mobile).
* **Simulated Overlay Systems:** A full-screen, blurred Call Overlay that manages its own mounting lifecycle (`AnimatePresence`) and simulates connection states and active call duration.

---

## 🏗️ Project Architecture

The application is built on a centralized global store pattern to avoid prop-drilling and ensure UI components remain strictly presentational.

```text
📦 src
 ┣ 📂 components        # Reusable UI components
 ┃ ┣ 📜 CallOverlay.jsx       # Voice/Video simulation logic
 ┃ ┣ 📜 ChatArea.jsx          # Main message rendering & input
 ┃ ┣ 📜 ChatContextMenu.jsx   # Desktop/Mobile interaction menus
 ┃ ┣ 📜 PollCard.jsx          # Interactive voting component
 ┃ ┣ 📜 Sidebar.jsx           # Chat list & navigation
 ┃ ┗ 📜 SummaryModal.jsx      # AI Typewriter effect modal
 ┣ 📂 layout
 ┃ ┗ 📜 MainLayout.jsx        # Responsive dual-pane wrapper
 ┣ 📂 pages
 ┃ ┗ 📜 Login.jsx             # Cyberpunk-themed entry gate
 ┣ 📂 store
 ┃ ┗ 📜 useChatStore.js       # Core Zustand Brain (Actions & State)
 ┣ 📜 App.jsx                 # Routing & Global Overlays
 ┗ 📜 main.jsx                # React Entry Point
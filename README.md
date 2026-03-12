

```markdown
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

It mimics the real-time interactivity of platforms like WhatsApp, Telegram, and Discord, featuring simulated AI participants, dynamic polling, Instagram-style stories, and fluid glassmorphism interfaces.

---

## ✨ Core Features & Technical Highlights

### 🤖 1. Simulated AI & Dynamic Interactivity
* **AI Conversation Summarizer:** Utilizes an asynchronous state sequence to simulate processing delays, followed by a custom typewriter effect hook to stream a context-aware TL;DR of the active chat.
* **Autonomous Poll Voting:** When a user creates a poll in a group, a background engine calculates randomized delays and automatically dispatches voting actions from simulated group members.
* **Ghost Traffic Engine:** A global simulation engine simulates incoming messages from inactive chats, updating unread badges and re-ordering the chat list in real-time.

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

The application enforces a strict separation of concerns, utilizing modular components, centralized state management, and custom hooks.

```text
📦 god-level-chat
 ┣ 📂 public/               # Static assets
 ┗ 📂 src/
   ┣ 📂 assets/             # Images, icons, and global styles
   ┣ 📂 components/         # Modular, reusable React components
   ┃ ┣ 📜 AddContactModal.jsx      # UI for adding new users
   ┃ ┣ 📜 CallOverlay.jsx          # Voice/Video call simulation logic
   ┃ ┣ 📜 ChatArea.jsx             # Main message thread rendering & input
   ┃ ┣ 📜 ChatContextMenu.jsx      # Desktop/Mobile chat interaction menus
   ┃ ┣ 📜 ConfirmModal.jsx         # Reusable destructive action safeguards
   ┃ ┣ 📜 CreateGroupModal.jsx     # Multi-select UI for group creation
   ┃ ┣ 📜 CreatePollModal.jsx      # Dynamic input fields for poll options
   ┃ ┣ 📜 DevNotice.jsx            # Persistent system status badge
   ┃ ┣ 📜 GodCommandPalette.jsx    # Global Cmd/Ctrl+K spotlight search
   ┃ ┣ 📜 MessageContextMenu.jsx   # Message-level actions (Edit/Delete/React)
   ┃ ┣ 📜 PollCard.jsx             # Interactive voting UI with progress bars
   ┃ ┣ 📜 SettingsModal.jsx        # Profile and theme management
   ┃ ┣ 📜 Sidebar.jsx              # Navigation, chat list, and mobile tabs
   ┃ ┣ 📜 StatusList.jsx           # Feed of user stories/updates
   ┃ ┣ 📜 StatusUploadModal.jsx    # Text/Image status creation UI
   ┃ ┣ 📜 StoryViewerModal.jsx     # Instagram-style auto-advancing viewer
   ┃ ┗ 📜 SummaryModal.jsx         # AI Typewriter effect modal
   ┣ 📂 features/           # Feature-specific slice logic
   ┣ 📂 hooks/              # Custom React hooks (e.g., useOutsideClick)
   ┣ 📂 layout/             # Structural layout wrappers
   ┣ 📂 pages/              # Top-level route components
   ┃ ┗ 📜 Login.jsx                # Animated sci-fi terminal entry gate
   ┣ 📂 store/              # Global state management
   ┃ ┗ 📜 useChatStore.js          # Core Zustand Brain (Actions, State, Mocks)
   ┣ 📂 utils/              # Helper functions (formatting, validation)
   ┗ 📜 App.css             # Global CSS variables and custom scrollbars

```

---

## 🛠️ Tech Stack

* **Framework:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/) (Utilizing the SWC compiler for lightning-fast HMR and builds)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Custom Glassmorphism, Animations, PostCSS)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight, un-opinionated state management without Context API prop drilling)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) (Declarative page transitions, exit animations, and micro-interactions)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Notifications:** React Hot Toast

---

## 🚀 Run Locally

Want to test the app on your own machine? Follow these steps:

1. **Clone the repository:**
```bash
git clone [https://github.com/Koustav2303/godchat.git](https://github.com/Koustav2303/godchat.git)

```


2. **Navigate to the project directory:**
```bash
cd god-level-chat

```


3. **Install dependencies:**
```bash
npm install

```


4. **Start the development server:**
```bash
npm run dev

```


5. **Open your browser:** Navigate to `http://localhost:5173`

---

## 📱 Usage Guide

1. **Login:** Enter any display name on the terminal login screen to initialize the system.
2. **Interact:** Click on "Alice Freeman" or "Project Alpha" to start chatting.
3. **Trigger Features:** * Click the **Sparkles (✨)** icon in the chat header to see the AI Summary in action.
* Click the **Chart (📊)** icon in the input bar to create a poll and watch the simulated members vote.
* Click the **Phone/Video** icons to trigger the immersive call overlay.
* **Right-click** any chat in the sidebar to Pin or Delete it.
* Press **Ctrl+K** (or Cmd+K) to open the Command Palette.



---

## 👨‍💻 Author

Developed with ❤️ by **Koustav Pan**

* Frontend Developer
* Email: pankoustav@gmail.com
* GitHub: [@Koustav2303](https://www.google.com/search?q=https://github.com/Koustav2303)

---

*Note: This is a frontend simulation. All data is managed locally via Zustand state and will reset upon a hard refresh. Designed specifically for UI/UX and architectural demonstration.*

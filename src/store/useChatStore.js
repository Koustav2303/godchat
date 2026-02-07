import { create } from "zustand";
import { format } from "date-fns";

const GROUP_RESPONSES = [
  "Agreed! 👍", "That sounds like a plan.", "Can we discuss this in the meeting?",
  "Lol 😂", "Nice work!", "I'm on it.", "Wait, really?", "👀", "Approved.", "100%"
];

const GHOST_MESSAGES = [
  "Hey, are you free?", "Check this out!", "Meeting in 5 mins.", "Hello?", 
  "Can you review this PR?", "Lunch?", "Sent you the file.", "Nice update!"
];

const useChatStore = create((set, get) => ({
  // 1. STATE
  currentUser: null,
  activeChatId: null,
  isTyping: false,
  typingUser: null,
  theme: "default",
  isCallActive: false,
  callType: null,
  callStatus: 'idle',
  
  // AI SUMMARY STATE
  isGeneratingSummary: false,
  summaryResult: null,

  // 2. DATA
  chats: [
    {
      id: 1,
      isGroup: false,
      pinned: true,
      name: "Alice Freeman",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      status: "online",
      phone: "+1 (555) 123-4567",
      bio: "UI/UX Designer. Coffee addict ☕",
      lastMessage: "Can you show me a screenshot? 📸",
      unreadCount: 0,
      messages: [{ id: 101, text: "Hey! Did you check the new design update?", time: "10:00 AM", isMe: false, reactions: {} }],
      stories: [
        { id: 1, type: "image", content: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&h=800&fit=crop", time: "2h ago", viewed: false },
        { id: 2, type: "text", content: "Working late tonight! 💻", background: "bg-purple-600", time: "1h ago", viewed: false }
      ]
    },
    {
      id: 2,
      isGroup: false,
      pinned: false,
      name: "Bob Designer",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
      status: "busy",
      phone: "+1 (555) 987-6543",
      bio: "Frontend Dev. React for life.",
      lastMessage: "I need the assets by EOD.",
      unreadCount: 2,
      messages: [{ id: 201, text: "I need the assets by EOD.", time: "09:30 AM", isMe: false, reactions: {} }],
      stories: [] 
    },
    {
      id: 3,
      isGroup: true,
      pinned: false,
      name: "Project Alpha",
      avatar: "https://ui-avatars.com/api/?name=Project+Alpha&background=random",
      status: "3 members",
      lastMessage: "Meeting at 5",
      unreadCount: 0,
      members: [
        { id: "me", name: "You", role: "admin", avatar: "https://i.pravatar.cc/150?u=me" },
        { id: 1, name: "Alice", role: "moderator", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
        { id: 2, name: "Bob", role: "member", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" }
      ],
      messages: [{ id: 301, text: "Meeting at 5", senderId: 1, time: "Yesterday", isMe: false, reactions: {} }],
      stories: [] 
    }
  ],
  
  myStories: [],

  // 3. ACTIONS
  login: (userInfo) => set({ currentUser: { ...userInfo, bio: "Hey there! I am using GodChat." } }),
  logout: () => set({ currentUser: null, activeChatId: null }),
  setTheme: (theme) => set({ theme }),

  // --- AI SUMMARY GENERATION ---
  generateSummary: () => {
    set({ isGeneratingSummary: true, summaryResult: null });
    
    const { activeChatId, chats } = get();
    const chat = chats.find(c => c.id === activeChatId);
    
    // Simulate AI Processing Time
    setTimeout(() => {
        let result = "";
        
        if (chat.isGroup) {
            result = `**Summary for ${chat.name}:**\n\nThe team is currently discussing upcoming deadlines. Key topics include the project roadmap and resource allocation. Sentiment is positive. Action items: Review the latest PRs before 5 PM.`;
        } else {
            // Dynamic based on last message to feel "real"
            const topic = chat.lastMessage.length > 50 ? "detailed project requirements" : "quick updates and casual catch-up";
            result = `**Conversation with ${chat.name}:**\n\nDiscussion revolves around ${topic}. \n\n**Key Insight:**\n"${chat.lastMessage}"\n\nSuggested action: Follow up tomorrow morning.`;
        }

        set({ isGeneratingSummary: false, summaryResult: result });
    }, 2500); // 2.5s simulated delay
  },

  closeSummary: () => set({ summaryResult: null, isGeneratingSummary: false }),

  // --- EXISTING ACTIONS ---
  createPoll: (question, options) => {
    const { activeChatId, chats } = get();
    const pollId = Date.now();
    const pollMessage = {
      id: pollId,
      type: 'poll',
      question,
      options: options.map((opt, idx) => ({ id: idx, text: opt, votes: [] })),
      time: format(new Date(), "hh:mm a"),
      isMe: true,
      reactions: {}
    };
    set(state => ({
      chats: state.chats.map(chat => chat.id === activeChatId ? { ...chat, messages: [...chat.messages, pollMessage], lastMessage: `📊 Poll: ${question}` } : chat)
    }));
    get().triggerAiPollResponse(activeChatId, pollId);
  },
  votePoll: (chatId, messageId, optionId, voterId = 'me') => {
    set(state => ({
      chats: state.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id === messageId && msg.type === 'poll') {
                const newOptions = msg.options.map(opt => ({ ...opt, votes: opt.votes.filter(id => id !== voterId) }));
                const targetOption = newOptions.find(o => o.id === optionId);
                if (targetOption) targetOption.votes.push(voterId);
                return { ...msg, options: newOptions };
              }
              return msg;
            })
          };
        }
        return chat;
      })
    }));
  },
  triggerAiPollResponse: (chatId, messageId) => {
    const { chats } = get();
    const chat = chats.find(c => c.id === chatId);
    if (!chat || !chat.isGroup) return;
    const botMembers = chat.members.filter(m => m.id !== 'me');
    botMembers.forEach((member, index) => {
        const delay = Math.random() * 8000 + 2000; 
        setTimeout(() => {
            const currentChat = get().chats.find(c => c.id === chatId);
            const pollMsg = currentChat?.messages.find(m => m.id === messageId);
            if (!pollMsg) return;
            const randomOptionIndex = Math.floor(Math.random() * pollMsg.options.length);
            get().votePoll(chatId, messageId, randomOptionIndex, member.id);
        }, delay + (index * 1000));
    });
  },
  editMessage: (chatId, messageId, newText) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, messages: chat.messages.map(msg => msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg) } : chat) })); },
  deleteMessage: (chatId, messageId) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, messages: chat.messages.map(msg => msg.id === messageId ? { ...msg, text: "🚫 This message was deleted", isDeleted: true, image: null, reactions: {}, type: 'text' } : msg) } : chat) })); },
  startCall: (type) => set({ isCallActive: true, callType: type, callStatus: 'ringing' }),
  acceptCall: () => set({ callStatus: 'connected' }),
  endCall: () => set({ isCallActive: false, callStatus: 'idle' }),
  togglePin: (chatId) => { const { chats } = get(); const chat = chats.find(c => c.id === chatId); if (!chat) return false; if (chat.pinned) { set({ chats: chats.map(c => c.id === chatId ? { ...c, pinned: false } : c) }); return true; } else { const pinnedCount = chats.filter(c => c.pinned).length; if (pinnedCount >= 3) return false; set({ chats: chats.map(c => c.id === chatId ? { ...c, pinned: true } : c) }); return true; } },
  deleteChat: (chatId) => { set((state) => ({ chats: state.chats.filter((c) => c.id !== chatId), activeChatId: state.activeChatId === chatId ? null : state.activeChatId })); },
  setActiveChat: (chatId) => set(state => ({ activeChatId: chatId, chats: state.chats.map(chat => chat.id === chatId ? { ...chat, unreadCount: 0 } : chat) })),
  sendMessage: (text, image = null, replyTo = null) => { const { activeChatId, chats } = get(); const newMessage = { id: Date.now(), text, image, replyTo, time: format(new Date(), "hh:mm a"), isMe: true, reactions: {} }; set(state => ({ chats: state.chats.map(chat => chat.id === activeChatId ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: image ? "Sent an image 📷" : text } : chat) })); get().triggerAutoReply(); },
  receiveMessage: (chatId, message) => { const { activeChatId } = get(); const isViewing = chatId === activeChatId; set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, messages: [...chat.messages, message], lastMessage: message.text || "Poll", unreadCount: isViewing ? 0 : (chat.unreadCount || 0) + 1 } : chat) })); },
  triggerAutoReply: () => { const { activeChatId, chats } = get(); const activeChat = chats.find(c => c.id === activeChatId); if (!activeChat) return; let responder = activeChat.isGroup ? activeChat.members.filter(m => m.id !== 'me')[Math.floor(Math.random() * (activeChat.members.length - 1))] : { name: activeChat.name, id: activeChat.id }; if(!responder) responder = { name: "Ghost", id: 999 }; const responseText = activeChat.isGroup ? GROUP_RESPONSES[Math.floor(Math.random() * GROUP_RESPONSES.length)] : "That looks amazing! 🔥"; setTimeout(() => { set({ isTyping: true, typingUser: responder.name }); setTimeout(() => { const msg = { id: Date.now(), text: responseText, senderId: responder.id, time: format(new Date(), "hh:mm a"), isMe: false, reactions: {} }; get().receiveMessage(activeChatId, msg); set({ isTyping: false, typingUser: null }); }, 2000); }, 1000); },
  simulateGhostTraffic: () => { const { chats, activeChatId } = get(); const inactiveChats = chats.filter(c => c.id !== activeChatId); if (inactiveChats.length === 0) return; const randomChat = inactiveChats[Math.floor(Math.random() * inactiveChats.length)]; const randomText = GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)]; const msg = { id: Date.now(), text: randomText, senderId: 999, time: format(new Date(), "hh:mm a"), isMe: false, reactions: {} }; get().receiveMessage(randomChat.id, msg); },
  addStory: (type, content, background = "bg-blue-600") => { const newStory = { id: Date.now(), type, content, background, time: "Just now", viewed: false }; set(state => ({ myStories: [...state.myStories, newStory] })); },
  viewStory: (chatId, storyId) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, stories: chat.stories.map(s => s.id === storyId ? { ...s, viewed: true } : s) } : chat) })); },
  replyToStory: (chatId, storyContent, replyText) => { const quoteText = `Replying to story: ${storyContent.substring(0, 20)}...`; get().sendMessage(replyText, null, { text: quoteText }); },
  updateProfile: (name, bio, avatar) => set((state) => ({ currentUser: { ...state.currentUser, name, bio, avatar } })),
  addReaction: (messageId, emoji) => { const { activeChatId, chats } = get(); set({ chats: chats.map(chat => chat.id === activeChatId ? { ...chat, messages: chat.messages.map(m => m.id === messageId ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] || 0) + 1 } } : m) } : chat) }); },
  addContact: (name, phone) => { const newContact = { id: Date.now(), isGroup: false, name, phone, avatar: `https://ui-avatars.com/api/?name=${name}&background=random`, status: "offline", bio: "New Contact", lastMessage: "Tap to chat", unreadCount: 0, messages: [], stories: [] }; set(state => ({ chats: [newContact, ...state.chats], activeChatId: newContact.id })); },
  createGroup: (groupName, groupImage, selectedMembers) => { const members = [{ id: "me", name: "You", role: "admin", avatar: "https://i.pravatar.cc/150?u=me" }, ...selectedMembers.map(m => ({ id: m.id, name: m.name, role: "member", avatar: m.avatar }))]; const newGroup = { id: Date.now(), isGroup: true, name: groupName, avatar: groupImage || `https://ui-avatars.com/api/?name=${groupName}&background=random`, status: `${members.length} members`, lastMessage: "Group created", unreadCount: 0, members, messages: [{ id: Date.now(), text: `Group "${groupName}" created`, isSystem: true, time: format(new Date(), "hh:mm a"), isMe: false, reactions: {} }], stories: [] }; set(state => ({ chats: [newGroup, ...state.chats], activeChatId: newGroup.id })); },
  addMember: (chatId, name, phone) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, members: [...chat.members, { id: Date.now(), name, phone, role: "member", avatar: `https://ui-avatars.com/api/?name=${name}&background=random` }], status: `${chat.members.length + 1} members`, messages: [...chat.messages, { id: Date.now(), text: `${name} added`, isSystem: true, time: format(new Date(), "hh:mm a"), isMe: false, reactions: {} }] } : chat) })); },
  updateRole: (chatId, memberId, newRole) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, members: chat.members.map(m => m.id === memberId ? { ...m, role: newRole } : m) } : chat) })); },
  clearChat: (chatId) => { set(state => ({ chats: state.chats.map(chat => chat.id === chatId ? { ...chat, messages: [] } : chat) })); }
}));

export default useChatStore;
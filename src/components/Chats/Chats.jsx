"use client";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { FiSend, FiSearch, FiMoreVertical, FiArrowLeft } from "react-icons/fi";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const SOCKET_SERVER_URL = "http://localhost:7860";

const Chats = ({ token, userId }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const socket = useRef();
  const messagesEndRef = useRef();
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chatId");

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowChatList(!activeChat);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [activeChat]);

// Connect socket
useEffect(() => {
  if (!token) return;

  socket.current = io(SOCKET_SERVER_URL, { auth: { token } });

  return () => {
    socket.current.disconnect();
  };
}, [token]);

  // Fetch all chats
  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/messaging/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data);

        if (chatIdFromQuery) {
          const active = res.data.find((c) => c._id === chatIdFromQuery);
          if (active) {
            setActiveChat(active);
            if (isMobile) setShowChatList(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, [token, chatIdFromQuery, isMobile]);

  // Update otherUser when activeChat changes
  useEffect(() => {
    if (!activeChat) return;
    const other = activeChat.participants.find((p) => p._id !== userId);
    setOtherUser(other);
  }, [activeChat, userId]);

  useEffect(() => {
  if (socket.current && activeChat?._id) {
    socket.current.emit("joinChat", activeChat._id);
  }
}, [activeChat]);

useEffect(() => {
  if (!socket.current) return;

 const handleIncoming = (msg) => {
  setMessages((prev) => {
    if (msg.senderId === userId) {
      if (msg.tempId) {
        const index = prev.findIndex((m) => m.tempId === msg.tempId);
        if (index !== -1) {
          const newMessages = [...prev];
          newMessages[index] = msg;
          return newMessages;
        }
      }
      const exists = prev.some(
        (m) =>
          m.text === msg.text &&
          m.chatId === msg.chatId &&
          m.senderId === msg.senderId
      );
      if (exists) return prev;
      if (alreadyExists) return prev;
      return prev; 
    }

    if (activeChat?._id === msg.chatId) {
      return [...prev, msg];
    }
    return prev;
  });

    // Update chats list for last message preview
    setChats((prev) =>
      prev.map((c) =>
        c._id === msg.chatId ? { ...c, messages: [...(c.messages || []), msg] } : c
      )
    );
  };

  socket.current.on("receiveMessage", handleIncoming);
  return () => socket.current.off("receiveMessage", handleIncoming);
}, [activeChat]);

useEffect(() => {
  if (!activeChat || !socket.current) return;

  const chatId = activeChat._id;
  socket.current.emit("joinChat", chatId);

  return () => {
    socket.current.emit("leaveChat", chatId);
  };
}, [activeChat]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_API}/messaging/${activeChat._id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChat, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
  if (!newMessage.trim() || !activeChat) return;

  const tempId = uuidv4();
  const messageData = {
    _id: null, 
      tempId,  
    text: newMessage,
    senderId: userId,
    createdAt: new Date().toISOString(),
  };

  // Optimistic update
  setMessages((prev) => [...prev, messageData]);

  // Emit to server
  socket.current.emit("sendMessage", {
    chatId: activeChat._id,
    senderId: userId,
    text: newMessage,
    tempId, 
  });

  setNewMessage("");
};

  const filteredChats = chats.filter(chat => {
    const other = chat.participants.find((p) => p._id !== userId);
    return other?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-red-50">
      {/* Chat List */}
      <div 
        className={`w-full md:w-1/3 border-r border-red-100 overflow-y-auto bg-white transition-all duration-300 ${
          showChatList ? "block" : "hidden md:block"
        }`}
        style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.1)" }}
      >
        <div className="p-4 border-b border-red-100 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="relative mt-3">
            <FiSearch className="absolute left-3 top-3 text-red-200" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-red-400 bg-opacity-20 text-white placeholder-red-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {filteredChats.map((chat) => {
            const other = chat.participants.find((p) => p._id !== userId);
            const lastMessage = chat.messages?.length > 0 
              ? chat.messages[chat.messages.length - 1] 
              : null;
            
            return (
              <div
                key={chat._id}
                className={`p-4 cursor-pointer border-b border-red-50 transition-all duration-200 ${
                  activeChat?._id === chat._id 
                    ? "bg-red-500 bg-opacity-10 border-l-4 border-l-red-500" 
                    : "hover:bg-red-50"
                }`}
                onClick={() => {
                  setActiveChat(chat);
                  if (isMobile) setShowChatList(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={other?.profilePicture || "/personlogo.png"}
                      alt={other?.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-red-100"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-gray-800 truncate">
                        {other?.username || "Unknown"}
                      </div>
                      {lastMessage && (
                        <div className="text-xs text-gray-500">
                          {formatTime(lastMessage.createdAt)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {lastMessage 
                        ? lastMessage.text 
                        : "No messages yet"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`w-full md:w-2/3 flex flex-col ${showChatList ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-red-100 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <button 
                    onClick={() => setShowChatList(true)}
                    className="md:hidden p-2 rounded-full hover:bg-red-100 text-red-500"
                  >
                    <FiArrowLeft />
                  </button>
                )}
                <img
                  src={otherUser?.profilePicture || "/personlogo.png"}
                  alt={otherUser?.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-100"
                />
                <div>
                  <div className="font-semibold text-gray-800">{otherUser?.username || "Unknown"}</div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-red-100 text-red-500">
                <FiMoreVertical />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-red-50">
              <div className="max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiSend className="text-red-500 text-xl" />
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                const isMine = msg.senderId === userId;
    const key = msg._id || msg.tempId || uuidv4();

      return (
                    <div
                      key={key}
                      className={`flex mb-4 ${(msg.sender?._id === userId || msg.senderId === userId) ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          (msg.sender?._id === userId || msg.senderId === userId)
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <div className="text-sm">{msg.text}</div>
                        <div className={`text-xs mt-1 ${(msg.sender?._id === userId || msg.senderId === userId) ? "text-red-100" : "text-gray-500"} text-right`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
                )}
                <div ref={messagesEndRef}></div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-red-100 mb-28">
              <div className="max-w-3xl mx-auto flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-3 border border-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-white to-red-50 p-4">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <FiSend className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Your messages</h3>
            <p className="text-center max-w-md">Select a conversation to start messaging or search to find someone.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
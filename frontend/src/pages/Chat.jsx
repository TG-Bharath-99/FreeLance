import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Chat = () => {
  const { id } = useParams(); // ID of the user we're chatting with
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${id}`);
      setMessages(res.data);
      
      // Determine chat partner from the first message, or we could fetch user profile if no messages
      if (res.data.length > 0) {
        const firstMsg = res.data[0];
        const partner = firstMsg.sender._id === id ? firstMsg.sender : firstMsg.receiver;
        setChatPartner(partner);
      } else {
        // Fetch user profile just to get name
        const userRes = await api.get(`/users/${id}`);
        setChatPartner(userRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(`/messages/${id}`, { content: newMessage });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

  if (loading && messages.length === 0) {
    return <div className="text-center py-20 text-slate-500">Loading chat...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-64px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to={user.role === 'client' ? "/client-dashboard" : "/my-applications"} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
              {chatPartner?.profileImage ? (
                 <img src={chatPartner.profileImage.startsWith('http') ? chatPartner.profileImage : `http://localhost:5000${chatPartner.profileImage}`} alt={chatPartner.name} className="h-full w-full object-cover" />
              ) : (
                chatPartner?.name?.charAt(0) || <User className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{chatPartner?.name || 'Loading...'}</h2>
              <span className="text-xs text-emerald-500 font-medium">Online</span>
            </div>
          </div>
        </div>
        {user.role === 'client' && (
          <Link
            to={`/payment/${id}`}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Proceed to Payment
          </Link>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 border-x border-slate-200 dark:border-slate-800 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender._id === user._id || msg.sender === user._id;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl p-4 shadow-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm dark:text-white transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            Send <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

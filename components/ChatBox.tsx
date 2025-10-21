'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, MessageCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { api, Message } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import { format } from 'date-fns';
import Image from 'next/image';

interface ChatBoxProps {
  orderId: string;
  adminId: string;
}

export default function ChatBox({ orderId, adminId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    // Fetch messages
    fetchMessages();

    // Poll for new messages every 5 seconds (only when chat is open)
    const interval = setInterval(() => {
      if (isOpen) {
        fetchMessages();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentUser, adminId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!currentUser) return;

    try {
      const response = await api.get(`/messages?sender_id=${currentUser.id}&receiver_id=${adminId}`);
      if (response.success) {
        setMessages(response.data);
        const unread = response.data.filter((msg: Message) => !msg.read && msg.sender_id === adminId).length;
        setUnreadCount(unread);

        // Mark messages as read when chat is open
        if (isOpen) {
          markAsRead();
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const markAsRead = async () => {
    if (!currentUser) return;

    try {
      await api.put('/messages', {
        sender_id: adminId,
        receiver_id: currentUser.id,
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      await api.post('/messages', {
        sender_id: currentUser.id,
        receiver_id: adminId,
        message_text: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'attachments');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await api.post('/messages', {
          sender_id: currentUser.id,
          receiver_id: adminId,
          message_text: file.name,
          attachment_url: `/api/files?fileId=${result.fileId}`,
        });
        fetchMessages();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }

    setUploading(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-temple-gold to-temple-darkGold text-white p-4 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gold-200 flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-temple-gold to-temple-darkGold text-white p-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-bold">Chat with Admin</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.sender_id === currentUser?.id;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={isCurrentUser ? 'chat-bubble-user' : 'chat-bubble-admin'}>
                      {message.attachment_url && (
                        <div className="mb-2">
                          {message.attachment_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <Image
                              src={message.attachment_url}
                              alt="attachment"
                              width={200}
                              height={150}
                              className="rounded-lg"
                            />
                          ) : (
                            <a
                              href={message.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 underline"
                            >
                              <FileText className="w-4 h-4" />
                              {message.message_text}
                            </a>
                          )}
                        </div>
                      )}
                      {!message.attachment_url && <p>{message.message_text}</p>}
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <Paperclip className="w-5 h-5 text-gray-500 hover:text-temple-gold" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-temple-gold"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-temple-gold text-white p-2 rounded-lg hover:bg-temple-darkGold disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

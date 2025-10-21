'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { api, Message, User } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export default function AdminChatPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [customer, setCustomer] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchCustomer();
    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [userId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/users`);
      if (response.success) {
        const user = response.data.find((u: User) => u.id === userId);
        if (user) {
          setCustomer(user);
        }
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    }
  };

  const fetchMessages = async () => {
    if (!currentUser) return;

    try {
      const response = await api.get(`/messages?sender_id=${currentUser.id}&receiver_id=${userId}`);
      if (response.success) {
        setMessages(response.data);

        // Mark messages as read
        await api.put('/messages', {
          sender_id: userId,
          receiver_id: currentUser.id,
        });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
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
        receiver_id: userId,
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
          receiver_id: userId,
          message_text: file.name,
          attachment_url: result.url,
        });
        fetchMessages();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Chat with {customer?.name || 'Customer'}
            </h1>
            <p className="text-sm text-gray-600">{customer?.mobile_number}</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isAdmin = message.sender_id === currentUser?.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div className={isAdmin ? 'chat-bubble-user' : 'chat-bubble-admin'}>
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
                    {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <label className="cursor-pointer flex items-center justify-center p-3 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-500" />
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-temple-gold"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-temple-gold text-white px-6 py-3 rounded-lg hover:bg-temple-darkGold disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

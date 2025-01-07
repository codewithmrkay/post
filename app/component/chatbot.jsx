'use client'

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Loader } from 'lucide-react';
import ChatMessage from './chatmessege';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, I encountered an error.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="text-black  min-w-4xl mx-auto my-8 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <MessageCircle className="mr-2" />
        <h2 className="text-xl font-semibold">Chat with Media Assistant</h2>
      </div>
      <div className="h-[50vh] overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-300 rounded-lg p-3 shadow">
              <div className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}


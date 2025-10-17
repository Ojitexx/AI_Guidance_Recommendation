// FIX: Re-added React types reference directive to resolve JSX intrinsic elements errors.
/// <reference types="react" />
import React, { useState } from 'react';

const ADVISERS = ["Mr Maikudi", "Mr Alfa", "Mr Olayemi D.O", "Mr Elmamud"];

interface Message {
  sender: 'bot' | 'user' | 'adviser';
  text?: string;
  options?: string[];
  adviserName?: string;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Welcome! I can connect you with a student adviser for counseling. Who would you like to talk to?', options: ADVISERS }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);

    const handleOptionClick = (adviser: string) => {
        setMessages(prev => [
            ...prev,
            { sender: 'user', text: `I'd like to speak with ${adviser}.`},
            { sender: 'bot', text: `Connecting you with ${adviser}... Please type your question below.`}
        ]);
        setSelectedAdviser(adviser);
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
        const messageText = input.value.trim();
        if (!messageText || !selectedAdviser) return;

        const newUserMessage: Message = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, newUserMessage]);
        input.value = '';
        setIsTyping(true);

        setTimeout(() => {
            const botResponse: Message = {
                sender: 'adviser',
                adviserName: selectedAdviser,
                text: "Thanks for your question. While I'm happy to help with general guidance, have you explored the 'Career Paths' and 'Library' sections? They contain detailed information that might answer your query. For official matters, please see the department's notice board."
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 2000);
    };


  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Open chat"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>

      <div className={`fixed bottom-24 right-6 w-80 h-[28rem] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <header className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg">Adviser Chat</h3>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">&times;</button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                       {msg.adviserName && <p className="font-bold text-sm">{msg.adviserName}</p>}
                       <p>{msg.text}</p>
                       {msg.options && (
                           <div className="mt-2 space-y-2">
                               {msg.options.map(option => (
                                   <button key={option} onClick={() => handleOptionClick(option)} className="w-full text-left bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-300 p-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-500">
                                       {option}
                                   </button>
                               ))}
                           </div>
                       )}
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex justify-start">
                    <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                 </div>
            )}
        </div>

        {selectedAdviser && (
            <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-200 dark:border-gray-700">
                <input 
                    type="text"
                    name="message"
                    placeholder="Type your message..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
                    autoComplete="off"
                />
            </form>
        )}
      </div>
    </>
  );
};
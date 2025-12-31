
import React, { useState, useRef, useEffect } from 'react';
import type { User, ChatMessage, SyntheticUser } from '../types';

interface ResearchHubPageProps {
    user: User;
    messages: ChatMessage[];
    onAddMessage: (text: string) => void;
    onlineUsers: SyntheticUser[];
    communityName: string;
    themeDescription: string;
}

const ResearchHubPage: React.FC<ResearchHubPageProps> = ({ user, messages, onAddMessage, onlineUsers, communityName, themeDescription }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onAddMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <section>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">{communityName} Research Hub</h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Global Community Channel. Discussing: <span className="italic text-[var(--text-accent)]">{themeDescription}</span>
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Chat Component */}
                <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-lg shadow-2xl flex flex-col" style={{ height: '70vh' }}>
                    {/* Message Display Area */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-4 ${msg.user.email === user.email ? 'flex-row-reverse' : ''}`}
                                >
                                    <img src={msg.user.picture} alt={msg.user.name} className="w-10 h-10 rounded-full" />
                                    <div
                                        className={`flex flex-col ${msg.user.email === user.email ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-lg max-w-sm ${msg.user.email === user.email
                                                    ? 'bg-[var(--accent-primary)] rounded-br-none'
                                                    : 'bg-[var(--bg-tertiary)] rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm text-[var(--text-primary)]">{msg.text}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 mt-1">
                                            {msg.user.name}, {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] opacity-50">
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Start the conversation to meet the Founding Members!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input Area */}
                    <div className="p-4 bg-black/20 border-t border-[var(--border-primary)]">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Message #${communityName.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-full py-2 px-4 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none"
                                aria-label="Chat message input"
                            />
                            <button
                                type="submit"
                                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-full p-3 flex-shrink-0 transition-colors"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-lg border border-[var(--border-primary)]">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)] border-b border-[var(--border-primary)] pb-2">Online Members</h3>
                        <ul className="space-y-4">
                            <li key={user.email} className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-[var(--bg-primary)]" />
                                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-[var(--bg-secondary)]"></span>
                                2</div>
                                <div>
                                    <span className="text-sm font-bold text-[var(--text-primary)] block">{user.name} (You)</span>
                                    <span className="text-xs text-[var(--text-secondary)]">Human Researcher</span>
                                </div>
                            </li>
                            
                            {/* Founding Members Section */}
                            {onlineUsers.length > 0 && (
                                <>
                                    <li className="pt-2">
                                        <p className="text-xs font-semibold text-[var(--text-accent)] uppercase tracking-wider">Founding Members (AI)</p>
                                    </li>
                                    {onlineUsers.map(u => (
                                        <li key={u.id} className="flex items-start gap-3 group">
                                            <div className="relative flex-shrink-0">
                                                <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full ring-2 ring-[var(--bg-primary)] group-hover:ring-[var(--accent-primary)] transition-all" />
                                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-[var(--bg-secondary)]"></span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-[var(--text-primary)] block">{u.name}</span>
                                                {/* Visualizing the data usage: showing the persona summary */}
                                                <span className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-tight" title={u.personaSummary}>
                                                    {u.personaSummary}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>
                    
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-lg border border-[var(--border-primary)]">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Community Context</h3>
                        <div className="text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] p-3 rounded-md italic">
                            "{themeDescription}"
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xs font-bold text-[var(--text-accent)] uppercase mb-2">Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-[var(--bg-primary)] rounded text-xs text-[var(--text-primary)] border border-[var(--border-primary)]">RAG Enabled</span>
                                <span className="px-2 py-1 bg-[var(--bg-primary)] rounded text-xs text-[var(--text-primary)] border border-[var(--border-primary)]">Context Aware</span>
                                <span className="px-2 py-1 bg-[var(--bg-primary)] rounded text-xs text-[var(--text-primary)] border border-[var(--border-primary)]">Persona Simulation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResearchHubPage;

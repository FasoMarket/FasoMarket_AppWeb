import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, MessageSquare, Check, CheckCheck, Clock, Trash2 } from 'lucide-react';
import { messageService }   from '../services/messageService';
import { useMessages }      from '../hooks/useMessages';
import { useSocket }        from '../contexts/SocketContext';
import { authService }      from '../services/authService';
import { cn }               from '../utils/cn';

export default function Messages() {
  const { id: conversationId }     = useParams();
  const navigate                   = useNavigate();
  const location                   = useLocation();
  const currentUser                = authService.getUser();
  const { onlineUsers, socket }    = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConvId,  setActiveConvId]  = useState(conversationId || null);
  const [inputValue,    setInputValue]    = useState('');
  const [showMenu,      setShowMenu]      = useState(false);
  const messagesEndRef                    = useRef(null);
  const menuRef                           = useRef(null);

  const { messages, loading, isTyping, typingUser, sendMessage, emitTyping } = useMessages(activeConvId);

  useEffect(() => {
    messageService.getConversations()
      .then(res => {
        if (res.data.success) {
          setConversations(res.data.conversations || []);
        }
      });
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ conversationId: cid, lastMessage, unreadCount }) => {
      setConversations(prev => prev.map(c =>
        c._id === cid ? { ...c, lastMessage, unreadCount, lastMessageAt: new Date() } : c
      ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
    };
    socket.on('conversation:updated', handler);
    return () => socket.off('conversation:updated', handler);
  }, [socket]);

  useEffect(() => {
    if (conversationId) {
        setActiveConvId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  useEffect(() => {
      const handleClickOutside = (e) => {
          if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleSelectConversation = (conv) => {
    setActiveConvId(conv._id);
    if (conversationId !== conv._id) {
      navigate(`${location.pathname.split('/')[1] === 'vendor' ? '/vendor' : ''}/messages/${conv._id}`, { replace: true });
    }
    setConversations(prev => prev.map(c =>
      c._id === conv._id ? { ...c, unreadCount: 0 } : c
    ));
    setShowMenu(false);
  };

  const handleMarkAsRead = async () => {
      try {
          await messageService.markAsRead(activeConvId);
          setConversations(prev => prev.map(c => c._id === activeConvId ? {...c, unreadCount:0} : c));
          setShowMenu(false);
      } catch (err) { console.error(err); }
  };

  const handleDeleteConversation = async () => {
      if (!window.confirm("Supprimer cette conversation ?")) return;
      try {
          await messageService.deleteConversation(activeConvId);
          setConversations(prev => prev.filter(c => c._id !== activeConvId));
          setActiveConvId(null);
          navigate('/messages', { replace: true });
          setShowMenu(false);
      } catch (err) { console.error(err); }
  };

  const activeConv   = conversations.find(c => c._id === activeConvId);
  const interlocutor = activeConv?.otherParticipant;
  const isOnline     = interlocutor && onlineUsers.has(interlocutor._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-140px)] flex flex-col gap-6">
        {/* Bouton Retour Hors du Chatbox */}
        <div className="flex items-center">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all group"
            >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Retour</span>
            </button>
        </div>

        <div className="flex-1 flex bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">

        {/* ── LISTE CONVERSATIONS ── */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col transition-all duration-300 relative z-10 bg-white",
          activeConvId ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="py-20 text-center space-y-4 px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                    <MessageSquare size={40} />
                </div>
                <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest">Aucune discussion</p>
              </div>
            ) : (
              conversations.map(conv => {
                const other = conv.otherParticipant;
                const online = other && onlineUsers.has(other._id);
                const isActive = conv._id === activeConvId;
                return (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      'group flex items-center gap-3 p-4 cursor-pointer rounded-2xl transition-all border border-transparent',
                      isActive 
                        ? 'bg-slate-50 border-slate-100' 
                        : 'hover:bg-slate-50/50'
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-all">
                        {other?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      {online && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className={cn('text-sm truncate tracking-tighter uppercase italic', isActive ? 'font-black text-primary' : 'font-bold text-slate-800')}>
                          {other?.name || 'Utilisateur'}
                        </p>
                        <span className="text-[9px] font-black text-slate-300 uppercase">
                          {conv.lastMessageAt && new Date(conv.lastMessageAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p className={cn('text-xs truncate font-medium tracking-tight h-4', conv.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-400')}>
                          {conv.lastMessage?.content || 'Nouvelle conversation'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[22px] h-[22px] bg-primary text-white text-[10px] font-black rounded-xl flex items-center justify-center px-1.5 shadow-xl shadow-primary/30 animate-in zoom-in">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── ZONE DE CHAT ── */}
        <div className={cn(
          "flex-1 flex flex-col bg-slate-50/50 transition-all duration-300 relative z-10",
          !activeConvId ? "hidden md:flex" : "flex"
        )}>
          {activeConvId ? (
            <>
              {/* Header Chat Premium */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {interlocutor?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    {isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{interlocutor?.name}</h3>
                    <p className="text-[10px] font-medium text-slate-400">{isOnline ? 'En ligne' : 'Hors ligne'}</p>
                  </div>
                </div>
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-3 text-slate-400 hover:bg-slate-50 hover:text-primary rounded-xl transition-all"
                    >
                    <MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden">
                            <div className="p-2">
                                <button onClick={handleMarkAsRead} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-3">
                                    <CheckCheck size={16} className="text-primary" />
                                    Tout marquer comme lu
                                </button>
                                <button onClick={handleDeleteConversation} className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-3">
                                    <Trash2 size={16} />
                                    Supprimer la discussion
                                </button>
                            </div>
                        </div>
                    )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Chargement sécurisé...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary">
                                <Clock size={16} />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Début de la conversation</span>
                        </div>
                    </div>

                    {messages.map((msg, idx) => {
                      const isOwn = (msg.sender._id || msg.sender) === currentUser?._id;
                      const showDate = idx === 0 || new Date(messages[idx-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                      
                      return (
                        <div key={msg._id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {showDate && (
                            <div className="flex justify-center my-10">
                                <span className="px-6 py-2 bg-white border border-slate-100 shadow-sm text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                            </div>
                          )}
                          
                          <div className={cn('flex group items-end gap-3', isOwn ? 'flex-row-reverse' : 'flex-row')}>
                            {/* Avatar Miniature */}
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-sm shrink-0 mb-1",
                                isOwn ? "bg-slate-900 rotate-3" : "bg-primary -rotate-3"
                            )}>
                                {isOwn ? currentUser?.name?.[0]?.toUpperCase() : (interlocutor?.name?.[0]?.toUpperCase() || '?')}
                            </div>

                            <div className={cn('max-w-[80%] sm:max-w-[70%] space-y-1.5', isOwn ? 'items-end' : 'items-start')}>
                                <div className={cn(
                                    'px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm',
                                    isOwn
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                )}>
                                    <p className="tracking-tight">{msg.content}</p>
                                </div>
                                <div className={cn(
                                    'flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter transition-all duration-300 px-2',
                                    isOwn ? 'flex-row-reverse text-primary' : 'text-slate-400'
                                )}>
                                    <span>{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isOwn && (
                                        msg.isRead 
                                            ? <CheckCheck size={12} className="text-primary" title="Lu" /> 
                                            : <Check size={12} className="text-slate-300" title="Envoyé" />
                                    )}
                                </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex justify-start items-end gap-3 animate-in slide-in-from-left-4 duration-500">
                        <div className="w-8 h-8 rounded-xl bg-primary -rotate-3 flex items-center justify-center text-white font-black text-[10px] shadow-sm">
                            {interlocutor?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="bg-white border border-slate-100 rounded-[1.8rem] rounded-bl-none px-6 py-5 flex items-center gap-3 shadow-xl shadow-slate-200/50">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                              <span key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{typingUser} vous répond...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                  </>
                )}
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-2 pl-5 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); emitTyping(); }}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 bg-primary hover:bg-primary-600 disabled:opacity-20 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary/20"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                    <MessageSquare size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Vos Messages</h3>
                    <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                        Sélectionnez une conversation pour commencer à discuter.
                    </p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

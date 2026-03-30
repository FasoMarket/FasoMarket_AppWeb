import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, MessageSquare, Check, CheckCheck, Trash2, User, Phone, Video } from 'lucide-react';
import { messageService } from '../services/messageService';
import { useMessages } from '../hooks/useMessages';
import { useSocket } from '../contexts/SocketContext';
import { authService } from '../services/authService';

export default function Messages() {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getUser();
  const { onlineUsers, socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(conversationId || null);
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

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
    if (conversationId) setActiveConvId(conversationId);
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
    const basePath = location.pathname.includes('/vendor') ? '/vendor' : '';
    navigate(`${basePath}/messages/${conv._id}`, { replace: true });
    setConversations(prev => prev.map(c =>
      c._id === conv._id ? { ...c, unreadCount: 0 } : c
    ));
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

  const activeConv = conversations.find(c => c._id === activeConvId);
  const interlocutor = activeConv?.otherParticipant;
  const isOnline = interlocutor && onlineUsers.has(interlocutor._id);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Aujourd'hui";
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Hier";
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-100">
      {/* Sidebar - Liste des conversations */}
      <div className={`${activeConvId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray-200`}>
        {/* Header sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">Aucune conversation</p>
              <p className="text-gray-400 text-sm mt-1">Vos discussions apparaîtront ici</p>
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
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 transition-all ${
                    isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      isActive ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {other?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    {online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold truncate ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                        {other?.name || 'Utilisateur'}
                      </p>
                      <span className="text-xs text-gray-400">
                        {conv.lastMessageAt && formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.lastMessage?.content || 'Nouvelle conversation'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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

      {/* Zone de chat */}
      <div className={`${!activeConvId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white`}>
        {activeConvId ? (
          <>
            {/* Header du chat */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {interlocutor?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{interlocutor?.name || 'Utilisateur'}</h2>
                  <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                    {isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
                  <Video size={20} />
                </button>
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button 
                        onClick={handleDeleteConversation}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-sm"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => {
                    const isOwn = (msg.sender._id || msg.sender) === currentUser?._id;
                    const showDateHeader = idx === 0 || 
                      new Date(messages[idx-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                    
                    // Message produit
                    let productData = null;
                    if (msg.type === 'product_link') {
                      try {
                        productData = JSON.parse(msg.content);
                      } catch (e) {}
                    }

                    return (
                      <div key={msg._id}>
                        {/* Séparateur de date */}
                        {showDateHeader && (
                          <div className="flex items-center justify-center my-6">
                            <span className="px-4 py-1 bg-white text-gray-500 text-xs font-medium rounded-full shadow-sm">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        {/* Message */}
                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
                          <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar (seulement pour les messages reçus) */}
                            {!isOwn && (
                              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {interlocutor?.name?.[0]?.toUpperCase() || '?'}
                              </div>
                            )}

                            {/* Bulle du message */}
                            <div className={`group ${isOwn ? 'items-end' : 'items-start'}`}>
                              {productData ? (
                                // Message produit
                                <div className={`rounded-2xl overflow-hidden shadow-sm max-w-[280px] ${
                                  isOwn ? 'bg-blue-500' : 'bg-white border border-gray-200'
                                }`}>
                                  {productData.productImage && (
                                    <img 
                                      src={productData.productImage} 
                                      alt={productData.productName}
                                      className="w-full h-32 object-cover"
                                    />
                                  )}
                                  <div className="p-3">
                                    <p className={`text-xs font-medium mb-1 ${isOwn ? 'text-blue-100' : 'text-blue-500'}`}>
                                      📦 Produit partagé
                                    </p>
                                    <p className={`font-semibold text-sm ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                                      {productData.productName}
                                    </p>
                                    <p className={`font-bold mt-1 ${isOwn ? 'text-white' : 'text-blue-600'}`}>
                                      {productData.productPrice?.toLocaleString('fr-FR')} FCFA
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                // Message texte
                                <div className={`px-4 py-2.5 rounded-2xl ${
                                  isOwn 
                                    ? 'bg-blue-500 text-white rounded-br-md' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                </div>
                              )}
                              
                              {/* Heure et statut */}
                              <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[10px] text-gray-400">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isOwn && (
                                  msg.isRead 
                                    ? <CheckCheck size={14} className="text-blue-500" /> 
                                    : <Check size={14} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Indicateur de frappe */}
                  {isTyping && (
                    <div className="flex justify-start mb-2">
                      <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                          {interlocutor?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); emitTyping(); }}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          // État vide - pas de conversation sélectionnée
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="text-blue-500" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vos messages</h2>
            <p className="text-gray-500 max-w-sm">
              Sélectionnez une conversation pour commencer à discuter avec vos clients
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

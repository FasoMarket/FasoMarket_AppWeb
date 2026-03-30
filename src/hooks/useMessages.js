import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket }     from '../contexts/SocketContext';
import { messageService } from '../services/messageService';

export const useMessages = (conversationId) => {
  const { socket }           = useSocket();
  const [messages,  setMessages]   = useState([]);
  const [loading,   setLoading]    = useState(false);
  const [isTyping,  setIsTyping]   = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    messageService.getMessages(conversationId)
      .then(res => setMessages(res.data.messages || []))
      .catch(err => console.error('Error fetching messages:', err))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.emit('conversation:join', { conversationId });
    return () => socket.emit('conversation:leave', { conversationId });
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId: cid }) => {
      if (cid !== conversationId) return;
      
      // Éviter les doublons - vérifier par ID ou par contenu similaire récent
      setMessages(prev => {
        const exists = prev.some(m => 
          (m._id && m._id === message._id) ||
          (m.id && m.id === message._id) ||
          // Vérifier si même contenu + même expéditeur dans les 5 dernières secondes
          (m.content === message.content && 
           (m.sender?._id || m.sender?.id || m.sender) === (message.sender?._id || message.sender?.id || message.sender) &&
           Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 5000)
        );
        if (exists) return prev;
        return [...prev, message];
      });
    };

    const handleTypingStart = ({ userId, userName, conversationId: cid }) => {
      if (cid !== conversationId) return;
      setTypingUser(userName);
      setIsTyping(true);
    };

    const handleTypingStop = ({ conversationId: cid }) => {
      if (cid !== conversationId) return;
      setIsTyping(false);
      setTypingUser(null);
    };

    const handleMessagesRead = ({ readBy }) => {
      setMessages(prev => prev.map(m =>
        m.sender._id !== readBy ? { ...m, isRead: true } : m
      ));
    };

    socket.on('message:received',  handleNewMessage);
    socket.on('typing:start',      handleTypingStart);
    socket.on('typing:stop',       handleTypingStop);
    socket.on('messages:read',     handleMessagesRead);

    return () => {
      socket.off('message:received',  handleNewMessage);
      socket.off('typing:start',      handleTypingStart);
      socket.off('typing:stop',       handleTypingStop);
      socket.off('messages:read',     handleMessagesRead);
    };
  }, [socket, conversationId]);

  const sendMessage = useCallback((content, type = 'text') => {
    if (!socket || !content.trim() || !conversationId) return;
    socket.emit('message:send', { conversationId, content: content.trim(), type });
    socket.emit('typing:stop', { conversationId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, [socket, conversationId]);

  const emitTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit('typing:start', { conversationId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  }, [socket, conversationId]);

  return { messages, loading, isTyping, typingUser, sendMessage, emitTyping };
};

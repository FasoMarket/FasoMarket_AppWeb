import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

// Configuration des serveurs STUN/TURN pour WebRTC
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export default function VoiceCall({ 
  isOpen, 
  onClose, 
  targetUserId, 
  targetUserName,
  conversationId,
  isIncoming = false,
  callerName = ''
}) {
  const { socket } = useSocket();
  const [callStatus, setCallStatus] = useState(isIncoming ? 'incoming' : 'calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);
  const durationInterval = useRef(null);
  const ringtoneRef = useRef(null);

  // Nettoyer les ressources
  const cleanup = useCallback(() => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
    
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current = null;
    }
  }, []);

  // Initialiser WebRTC
  const initWebRTC = useCallback(async () => {
    try {
      // Obtenir le flux audio local
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      // Créer la connexion peer
      peerConnection.current = new RTCPeerConnection(iceServers);
      
      // Ajouter le flux local
      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });
      
      // Gérer le flux distant
      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };
      
      // Gérer les ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('webrtc:ice-candidate', {
            targetUserId,
            candidate: event.candidate
          });
        }
      };
      
      // Surveiller l'état de la connexion
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current?.connectionState;
        console.log('📡 WebRTC Connection State:', state);
        
        if (state === 'connected') {
          setCallStatus('connected');
          // Démarrer le chronomètre
          durationInterval.current = setInterval(() => {
            setDuration(d => d + 1);
          }, 1000);
        } else if (state === 'disconnected' || state === 'failed') {
          handleEndCall();
        }
      };
      
      return true;
    } catch (error) {
      console.error('❌ Erreur WebRTC:', error);
      setCallStatus('error');
      return false;
    }
  }, [socket, targetUserId]);

  // Créer et envoyer l'offre
  const createOffer = useCallback(async () => {
    if (!peerConnection.current) return;
    
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      socket?.emit('webrtc:offer', {
        targetUserId,
        offer
      });
    } catch (error) {
      console.error('❌ Erreur création offre:', error);
    }
  }, [socket, targetUserId]);

  // Créer et envoyer la réponse
  const createAnswer = useCallback(async (offer) => {
    if (!peerConnection.current) return;
    
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      socket?.emit('webrtc:answer', {
        targetUserId,
        answer
      });
    } catch (error) {
      console.error('❌ Erreur création réponse:', error);
    }
  }, [socket, targetUserId]);

  // Accepter l'appel
  const handleAcceptCall = useCallback(async () => {
    setCallStatus('connecting');
    const initialized = await initWebRTC();
    if (initialized) {
      socket?.emit('call:accept', { callerId: targetUserId, conversationId });
    }
  }, [initWebRTC, socket, targetUserId, conversationId]);

  // Refuser l'appel
  const handleRejectCall = useCallback(() => {
    socket?.emit('call:reject', { callerId: targetUserId, reason: 'Appel refusé' });
    cleanup();
    onClose();
  }, [socket, targetUserId, cleanup, onClose]);

  // Terminer l'appel
  const handleEndCall = useCallback(() => {
    socket?.emit('call:end', { targetUserId, conversationId });
    cleanup();
    onClose();
  }, [socket, targetUserId, conversationId, cleanup, onClose]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    if (remoteAudio.current) {
      remoteAudio.current.muted = !remoteAudio.current.muted;
      setIsSpeakerOff(remoteAudio.current.muted);
    }
  }, []);

  // Formater la durée
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Effets pour les appels sortants
  useEffect(() => {
    if (!isOpen || isIncoming) return;
    
    const startCall = async () => {
      const initialized = await initWebRTC();
      if (initialized) {
        socket?.emit('call:initiate', {
          targetUserId,
          conversationId,
          callerName: '' // Will use socket.user.name
        });
      }
    };
    
    startCall();
    
    return cleanup;
  }, [isOpen, isIncoming, initWebRTC, socket, targetUserId, conversationId, cleanup]);

  // Écouter les événements socket
  useEffect(() => {
    if (!socket) return;

    const handleCallAccepted = async () => {
      console.log('✅ Appel accepté');
      setCallStatus('connecting');
      await createOffer();
    };

    const handleCallRejected = ({ reason }) => {
      console.log('❌ Appel refusé:', reason);
      setCallStatus('rejected');
      setTimeout(() => {
        cleanup();
        onClose();
      }, 2000);
    };

    const handleCallEnded = () => {
      console.log('📵 Appel terminé');
      setCallStatus('ended');
      setTimeout(() => {
        cleanup();
        onClose();
      }, 1000);
    };

    const handleCallError = ({ message }) => {
      console.log('❌ Erreur appel:', message);
      setCallStatus('error');
      setTimeout(() => {
        cleanup();
        onClose();
      }, 2000);
    };

    const handleWebRTCOffer = async ({ offer }) => {
      console.log('📥 Offre WebRTC reçue');
      await createAnswer(offer);
    };

    const handleWebRTCAnswer = async ({ answer }) => {
      console.log('📥 Réponse WebRTC reçue');
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleICECandidate = async ({ candidate }) => {
      if (peerConnection.current && candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('❌ Erreur ajout ICE candidate:', error);
        }
      }
    };

    socket.on('call:accepted', handleCallAccepted);
    socket.on('call:rejected', handleCallRejected);
    socket.on('call:ended', handleCallEnded);
    socket.on('call:error', handleCallError);
    socket.on('webrtc:offer', handleWebRTCOffer);
    socket.on('webrtc:answer', handleWebRTCAnswer);
    socket.on('webrtc:ice-candidate', handleICECandidate);

    return () => {
      socket.off('call:accepted', handleCallAccepted);
      socket.off('call:rejected', handleCallRejected);
      socket.off('call:ended', handleCallEnded);
      socket.off('call:error', handleCallError);
      socket.off('webrtc:offer', handleWebRTCOffer);
      socket.off('webrtc:answer', handleWebRTCAnswer);
      socket.off('webrtc:ice-candidate', handleICECandidate);
    };
  }, [socket, createOffer, createAnswer, cleanup, onClose]);

  if (!isOpen) return null;

  const statusMessages = {
    calling: 'Appel en cours...',
    incoming: 'Appel entrant...',
    connecting: 'Connexion...',
    connected: formatDuration(duration),
    rejected: 'Appel refusé',
    ended: 'Appel terminé',
    error: 'Erreur de connexion'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-8 w-80 text-center shadow-2xl">
        {/* Avatar */}
        <div className="relative mx-auto mb-6">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto ${callStatus === 'calling' || callStatus === 'incoming' ? 'animate-pulse' : ''}`}>
            {(targetUserName || callerName)?.[0]?.toUpperCase() || '?'}
          </div>
          {callStatus === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800" />
          )}
        </div>

        {/* Nom */}
        <h3 className="text-xl font-semibold text-white mb-2">
          {isIncoming ? callerName : targetUserName}
        </h3>

        {/* Statut */}
        <p className={`text-sm mb-8 ${callStatus === 'connected' ? 'text-green-400 font-mono text-lg' : 'text-gray-400'}`}>
          {statusMessages[callStatus]}
        </p>

        {/* Boutons pour appel entrant */}
        {callStatus === 'incoming' && (
          <div className="flex justify-center gap-8">
            <button
              onClick={handleRejectCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg hover:shadow-red-500/30"
            >
              <PhoneOff size={28} />
            </button>
            <button
              onClick={handleAcceptCall}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition shadow-lg hover:shadow-green-500/30 animate-bounce"
            >
              <Phone size={28} />
            </button>
          </div>
        )}

        {/* Boutons pendant l'appel */}
        {(callStatus === 'calling' || callStatus === 'connecting' || callStatus === 'connected') && (
          <div className="flex justify-center gap-4">
            {callStatus === 'connected' && (
              <>
                <button
                  onClick={toggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                  onClick={toggleSpeaker}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                    isSpeakerOff 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isSpeakerOff ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </>
            )}
            <button
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        )}

        {/* Message d'erreur ou fin d'appel */}
        {(callStatus === 'rejected' || callStatus === 'ended' || callStatus === 'error') && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition"
          >
            Fermer
          </button>
        )}

        {/* Audio distant */}
        <audio ref={remoteAudio} autoPlay />
      </div>
    </div>
  );
}

// Hook pour gérer les appels entrants globalement
export function useIncomingCalls() {
  const { socket } = useSocket();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ callerId, callerName, conversationId }) => {
      console.log('📞 Appel entrant de:', callerName);
      setIncomingCall({ callerId, callerName, conversationId });
    };

    socket.on('call:incoming', handleIncomingCall);

    return () => {
      socket.off('call:incoming', handleIncomingCall);
    };
  }, [socket]);

  const clearIncomingCall = () => setIncomingCall(null);

  return { incomingCall, clearIncomingCall };
}

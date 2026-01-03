"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { io, Socket } from "socket.io-client";
import { showToast } from "./Toast";
import type {
  CallContext,
  RealtimeCallEvent,
  AudioFlag,
  CallUserSettings,
} from "@verba/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface RealtimeCallInterfaceProps {
  callId: string;
  context: CallContext;
  onCallEnd?: () => void;
}

export default function RealtimeCallInterface({
  callId,
  context,
  onCallEnd,
}: RealtimeCallInterfaceProps) {
  const { session, user } = useAuth();
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [flags, setFlags] = useState<AudioFlag[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [premiumCheck, setPremiumCheck] = useState<boolean | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Check premium access
  useEffect(() => {
    const checkPremium = async () => {
      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/subscriptions/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isPremium = data.data?.isPremium;
          const tier = data.data?.premiumTier;

          // Real-time calls require PRO or UNLIMITED
          if (!isPremium || (tier !== "pro" && tier !== "unlimited")) {
            showToast("Real-time call analysis requires PRO or UNLIMITED subscription", "error");
            router.push("/subscription");
            return;
          }

          setPremiumCheck(true);
        } else {
          setPremiumCheck(false);
          router.push("/subscription");
        }
      } catch (error) {
        console.error("Premium check error:", error);
        setPremiumCheck(false);
      }
    };

    checkPremium();
  }, [session, router]);

  useEffect(() => {
    if (!session?.access_token) return;

    // Initialize WebSocket connection
    const newSocket = io(API_BASE_URL, {
      auth: {
        token: session.access_token,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Join call
      newSocket.emit("join_call", {
        type: "join_call",
        callId,
        userId: session.user.id,
        context,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    newSocket.on("realtime_event", (event: RealtimeCallEvent) => {
      handleRealtimeEvent(event);
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error("WebSocket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [callId, context, session]);

  const handleRealtimeEvent = (event: RealtimeCallEvent) => {
    switch (event.type) {
      case "transcription":
        setCurrentTranscription(event.data.text);
        break;

      case "flag":
        const flag = (event.data as any).flag as AudioFlag;
        setFlags((prev) => [...prev, flag]);
        if (flag.actionTaken.warningShown) {
          // Show warning in UI
          console.warn("Content flagged:", flag.flagReason);
        }
        break;

      case "mute":
        const muteData = event.data as any;
        if (muteData.muted) {
          setIsMuted(true);
          muteMicrophone();
          // Play audio prompt if enabled
          if (context.userSettings.enableAudioPrompts) {
            playAudioPrompt();
          }
        }
        break;

      case "unmute":
        setIsMuted(false);
        unmuteMicrophone();
        break;

      case "suggestion":
        const suggestionData = event.data as any;
        setSuggestions((prev) => [...prev, suggestionData.suggestion]);
        break;
    }
  };

  const startCall = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create MediaRecorder for audio chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket) {
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            socket.emit("audio_chunk", {
              type: "audio_chunk",
              callId,
              audioData: base64Audio,
              format: "webm",
              sampleRate: audioContext.sampleRate,
            });
          };
          reader.readAsDataURL(event.data);
        }
      };

      // Start recording in chunks (every 1 second)
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Failed to access microphone. Please check permissions.");
    }
  };

  const stopCall = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (socket) {
      socket.emit("leave_call", callId);
    }
    setIsRecording(false);
    onCallEnd?.();
  };

  const muteMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  };

  const unmuteMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  };

  const playAudioPrompt = () => {
    // Create a beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  if (premiumCheck === null) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p>Checking premium access...</p>
        </div>
      </div>
    );
  }

  if (premiumCheck === false) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Real-Time Call Analysis</h1>
            <p className="text-gray-400">
              {context.callType} call • {context.participants.length} participants
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex gap-4 items-center">
            {!isRecording ? (
              <button
                onClick={startCall}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                Start Call
              </button>
            ) : (
              <button
                onClick={stopCall}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
              >
                End Call
              </button>
            )}

            {isMuted && (
              <div className="bg-yellow-600 px-4 py-2 rounded-lg">
                ⚠️ Muted - Content flagged
              </div>
            )}
          </div>
        </div>

        {/* Live Transcription */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Live Transcription</h2>
          <div className="bg-gray-900 rounded p-4 min-h-[100px]">
            <p className="text-gray-300">{currentTranscription || "Waiting for audio..."}</p>
          </div>
        </div>

        {/* Flags */}
        {flags.length > 0 && (
          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">⚠️ Content Flags</h2>
            <div className="space-y-2">
              {flags.slice(-5).map((flag) => (
                <div key={flag.id} className="bg-red-900/50 rounded p-2">
                  <p className="text-sm">
                    <strong>{flag.flagReason}</strong> - {flag.transcribedText}
                  </p>
                  <p className="text-xs text-gray-400">
                    Severity: {flag.severity} • Confidence: {Math.round(flag.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">💡 Suggestions</h2>
            <ul className="space-y-2">
              {suggestions.slice(-3).map((suggestion, idx) => (
                <li key={idx} className="bg-blue-900/50 rounded p-2 text-sm">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


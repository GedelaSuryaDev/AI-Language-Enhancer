import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Trash2, Volume2, Loader2, MessageSquare, Zap } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [totalTokens, setTotalTokens] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError('Failed to access microphone. Please grant permission.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processAudio = async () => {
    if (!audioBlob) {
      setError('No audio recorded');
      return;
    }

    setIsProcessing(true);
    setError('');
    setTranscription('');
    setAiResponse('');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const response = await axios.post(`${API_BASE_URL}/process-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setTranscription(response.data.transcription);
        setAiResponse(response.data.ai_response);
        
        // Store token usage
        const tokens = response.data.token_usage;
        setTokenUsage(tokens);
        if (tokens) {
          setTotalTokens(prev => prev + tokens.total_tokens);
        }
        
        // Add to conversation history
        setConversationHistory(prev => [
          ...prev,
          {
            user: response.data.transcription,
            ai: response.data.ai_response,
            timestamp: new Date().toLocaleTimeString(),
            tokens: tokens
          }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process audio. Please try again.');
      console.error('Error processing audio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setTranscription('');
    setAiResponse('');
    setError('');
    setRecordingTime(0);
    setTokenUsage(null);
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setTotalTokens(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Centered Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img src="/logo.svg" alt="Acharya AI" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
            Acharya AI
          </h1>
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            ఆచార్య AI
          </p>
          <p className="text-gray-600 text-lg">
            Speak in Telugu and get enhanced, refined responses
          </p>
          <p className="text-gray-500 text-sm mt-2">
            తెలుగులో మాట్లాడండి మరియు మెరుగైన, శుద్ధమైన వాక్యాలు పొందండి
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <Volume2 className="text-blue-600" />
              Audio Input
            </h2>

            {/* Recording Controls */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-2xl'}`}
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>
                
                {isRecording && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border-2 border-red-500">
                    <span className="text-red-500 font-mono font-semibold">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-center">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>

              {/* Action Buttons */}
              {audioBlob && !isRecording && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={processAudio}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Process Audio
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearRecording}
                    disabled={isProcessing}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Current Results */}
            {(transcription || aiResponse) && (
              <div className="mt-6 space-y-4">
                {transcription && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Your Message:</p>
                    <p className="text-gray-800">{transcription}</p>
                  </div>
                )}
                
                {aiResponse && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-purple-900">AI Response:</p>
                      {tokenUsage && (
                        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                          <Zap className="w-3 h-3" />
                          <span>{tokenUsage.total_tokens} tokens</span>
                          <span className="text-purple-500">({tokenUsage.prompt_tokens}+{tokenUsage.completion_tokens})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversation History Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                  <MessageSquare className="text-purple-600" />
                  Conversation History
                </h2>
                {totalTokens > 0 && (
                  <div className="flex items-center gap-1 text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">{totalTokens}</span>
                    <span className="text-xs">total</span>
                  </div>
                )}
              </div>
              {conversationHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {conversationHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start recording to begin chatting</p>
                </div>
              ) : (
                conversationHistory.map((item, index) => (
                  <div key={index} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                        <Mic className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{item.timestamp}</p>
                        <p className="text-gray-800">{item.user}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 ml-4">
                      <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                          <p className="text-gray-800">{item.ai}</p>
                        </div>
                        {item.tokens && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Zap className="w-3 h-3" />
                            <span>{item.tokens.total_tokens} tokens</span>
                            <span className="text-gray-400">• {item.tokens.prompt_tokens} prompt + {item.tokens.completion_tokens} completion</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="font-semibold text-gray-700">Powered by OpenAI Whisper & GPT-4o-mini</p>
          <p className="text-xs mt-1">© 2025 Acharya - Telugu Language Enhancement AI</p>
          {totalTokens > 0 && (
            <p className="mt-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Session Total: <strong>{totalTokens}</strong> tokens</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

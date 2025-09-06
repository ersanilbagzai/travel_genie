import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Plane, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';
import type { ItineraryData } from './Itinerary';

function parseSimpleItinerary(text: string): ItineraryData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
  
  // Extract title (first line before any "Day X:" pattern)
  let title = 'Your Itinerary';
  let description = '';
  let startIndex = 0;
  
  // Look for title in the first few lines
  if (lines.length > 0 && !lines[0].match(/^Day \d+:/)) {
    title = lines[0].replace(/[:\n]/g, '').trim();
    startIndex = 1;
  }
  
  // Find where day sections start and end
  const dayIndices = [];
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].match(/^Day \d+:/)) {
      dayIndices.push(i);
    }
  }
  
  // Extract description (lines before first day or between title and first day)
  if (dayIndices.length > 0) {
    const descLines = lines.slice(startIndex, dayIndices[0]).filter(line => 
      !line.match(/^Day \d+:/) && 
      !line.match(/^Budget/) && 
      !line.match(/^Does this/)
    );
    description = descLines.join(' ').trim();
  }
  
  const days = [];
  
  // Process each day section
  for (let i = 0; i < dayIndices.length; i++) {
    const dayLineIndex = dayIndices[i];
    const dayLine = lines[dayLineIndex];
    const dayMatch = dayLine.match(/^Day (\d+):/);
    
    if (dayMatch) {
      const dayNumber = parseInt(dayMatch[1]);
      const nextDayIndex = i + 1 < dayIndices.length ? dayIndices[i + 1] : lines.length;
      
      // Extract activities for this day (lines between current day and next day)
      const dayActivityLines = lines.slice(dayLineIndex + 1, nextDayIndex);
      const activities = [];
      
      for (const activityLine of dayActivityLines) {
        // Stop if we hit budget summary or other non-activity content
        if (activityLine.match(/^Budget|^Does this|^Approximate|^Total/)) {
          break;
        }
        
        // Parse activity lines that start with "- Time:"
        const activityMatch = activityLine.match(/^-\s*([^:]+):\s*(.+)$/);
        if (activityMatch) {
          const [, time, activity] = activityMatch;
          activities.push({
            time: time.trim(),
            activity: activity.trim(),
            type: 'activity'
          });
        } else if (activityLine.startsWith('-') && activityLine.length > 2) {
          // Handle activities without specific time format
          const activity = activityLine.substring(1).trim();
          if (activity) {
            activities.push({
              activity: activity,
              type: 'activity'
            });
          }
        }
      }
      
      if (activities.length > 0) {
        days.push({
          day: dayNumber,
          title: `Day ${dayNumber}`,
          activities: activities
        });
      }
    }
  }
  
  // Extract budget/summary information
  let summary;
  const budgetLines = lines.filter(line => 
    line.match(/^Budget|^Approximate|^Total/) && 
    !line.match(/^Does this/)
  );
  
  if (budgetLines.length > 0) {
    summary = {
      totalCost: budgetLines.join(' ').replace(/Budget Summary:\s*|Approximate costs?\s*/i, '').trim(),
      totalDays: days.length
    };
  }

  return {
    title: title,
    description: description,
    days: days,
    summary: summary
  };
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatProps {
  user: User | null;
  onItineraryReceived?: (itinerary: ItineraryData) => void;
}

const Chat: React.FC<ChatProps> = ({ user, onItineraryReceived }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: user 
        ? `Hello ${user.name}! I'm your AI travel assistant. I'm here to help you discover amazing destinations and create personalized itineraries. Tell me about your travel dreams - where would you like to go, what activities interest you, or what kind of experience are you looking for?`
        : "Hello! I'm your AI travel assistant. I'm here to help you discover amazing destinations and create personalized itineraries. Tell me about your travel dreams - where would you like to go, what activities interest you, or what kind of experience are you looking for?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch API URL from system configuration
  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('system_conf')
          .select('value')
          .eq('key', 'TRAVEL_APP_AI_AGENT_API_URL')
          .single();

        if (error) {
          console.error('Error fetching API URL:', error);
          setApiError('Failed to load AI configuration');
          return;
        }

        if (data?.value) {
          setApiUrl(data.value);
          setApiError(null);
        } else {
          setApiError('AI agent API URL not configured');
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
        setApiError('Failed to load AI configuration');
      }
    };

    fetchApiUrl();
  }, []);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callAIApi = async (userMessage: string): Promise<{ type: 'message' | 'itinerary', data: string | ItineraryData }> => {
    if (!apiUrl) {
      throw new Error('AI agent API URL not configured. Please check system configuration.');
    }

    // Get session ID from Supabase auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Authentication error: ${sessionError.message}`);
    }
    
    if (!session || !session.access_token) {
      throw new Error('No valid session found. Please sign in again.');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sessionid': session.access_token,
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response format
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid API response format: expected non-empty array');
      }

      const firstResponse = data[0];
      if (!firstResponse || typeof firstResponse !== 'object') {
        throw new Error('Invalid API response format: first element is not an object');
      }

      if (!['message', 'itinerary'].includes(firstResponse.response_type)) {
        throw new Error(`Unsupported response type: ${firstResponse.response_type}`);
      }

      if (typeof firstResponse.response !== 'string') {
        // If response is not a string, it might be an object for itinerary type
        if (firstResponse.response_type === 'itinerary' && typeof firstResponse.response === 'object') {
          return { type: 'itinerary', data: firstResponse.response };
        }
        throw new Error('Invalid API response format: response field is neither string nor object');
      }

      // Handle responses where response is a string
      if (firstResponse.response_type === 'itinerary') {
        try {
          const itineraryData = JSON.parse(firstResponse.response);
          return { type: 'itinerary', data: itineraryData };
        } catch (parseError) {
          if (typeof firstResponse.response === 'string') {
            const parsedData = parseSimpleItinerary(firstResponse.response);
            return { type: 'itinerary', data: parsedData };
          }
          console.error('Failed to parse itinerary:', parseError);
          throw new Error("I received an itinerary, but it was in a format I couldn't understand.");
        }
      }
      
      return { type: 'message', data: firstResponse.response };

    } catch (error) {
      console.error('AI API call failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to AI service. Please check your internet connection.');
      }
      
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return; 
    
    // Check if API is configured
    if (apiError) {
      // Show configuration error in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm currently unable to respond due to a configuration issue: ${apiError}. Please contact support for assistance.`, 
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await callAIApi(inputValue);
      
      if (aiResponse && typeof aiResponse === 'object' && aiResponse.type === 'itinerary') {
        // Handle itinerary response
        if (onItineraryReceived) {
          onItineraryReceived(aiResponse.data);
        }
        
        // Add a message to chat indicating itinerary was generated
        const itineraryMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I've generated a personalized itinerary for you! Check it out in the itinerary panel on the right. ✈️",
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, itineraryMessage]);
      } else {
        // Handle regular message response
        const messageResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: typeof aiResponse === 'string' ? aiResponse : aiResponse.data,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, messageResponse]);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm having trouble processing your request right now. ${ 
          error instanceof Error ? error.message : 'Please try again later.' 
        }`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        content: user 
          ? `Hello ${user.name}! I'm your AI travel assistant. I'm here to help you discover amazing destinations and create personalized itineraries. Tell me about your travel dreams - where would you like to go, what activities interest you, or what kind of experience are you looking for?`
          : "Hello! I'm your AI travel assistant. I'm here to help you discover amazing destinations and create personalized itineraries. Tell me about your travel dreams - where would you like to go, what activities interest you, or what kind of experience are you looking for?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  // Expose clearConversation function to parent component
  React.useImperativeHandle(ref, () => ({
    clearConversation
  }), [user]);

  return (
    <div className="flex flex-col h-full bg-white/50">
      {/* Chat Messages */}
      <div ref={chatMessagesRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`max-w-xs sm:max-w-md lg:max-w-2xl ${
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-200/50'
              } px-4 py-3 relative`}>
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">TravelGenie</span>
                  </div>
                )}
                <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fadeInUp">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200/50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">TravelGenie</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your dream destination..."
                className="w-full px-4 py-3 pr-12 bg-white rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-colors duration-200"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Plane className="w-4 h-4 text-gray-400" />
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Discover amazing destinations • Get personalized itineraries • Find unique activities
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Forward ref to allow parent to call clearConversation
const ref = React.createRef<{ clearConversation: () => void }>();

export default Chat;

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Plane, MessageCircle } from 'lucide-react';
import type { User } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatProps {
  user: User | null;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('japan') || message.includes('tokyo') || message.includes('kyoto')) {
      return `🏯 Japan sounds incredible! Here's a tailored 7-day itinerary:

**Days 1-3: Tokyo**
• Visit Senso-ji Temple and Asakusa district
• Experience the bustling Shibuya crossing
• Explore traditional markets in Tsukiji
• Enjoy authentic ramen in Golden Gai

**Days 4-5: Kyoto** 
• Tour the famous Fushimi Inari shrine
• Walk through the bamboo groves of Arashiyama
• Experience a traditional tea ceremony
• Stay in a ryokan for authentic culture

**Days 6-7: Mount Fuji & Hakone**
• Take the scenic train to Hakone
• Relax in natural hot springs (onsen)
• Capture stunning views of Mount Fuji

Would you like me to suggest specific restaurants, hotels, or activities for any of these locations?`;
    }
    
    if (message.includes('europe') || message.includes('paris') || message.includes('rome') || message.includes('london')) {
      return `🏰 A European adventure awaits! Here's a classic 10-day grand tour:

**Days 1-3: Paris, France**
• Explore the Louvre and Eiffel Tower
• Stroll along the Champs-Élysées
• Day trip to Versailles Palace
• Seine river cruise at sunset

**Days 4-6: Rome, Italy**
• Discover the Colosseum and Roman Forum
• Throw a coin in the Trevi Fountain
• Explore Vatican City and Sistine Chapel
• Enjoy authentic pasta in Trastevere

**Days 7-10: London, England**
• Tour the Tower of London and Big Ben
• Experience the British Museum
• Take afternoon tea in Covent Garden
• Day trip to Windsor Castle

Each city offers unique experiences - would you prefer art and culture, culinary adventures, or historical exploration?`;
    }
    
    if (message.includes('beach') || message.includes('tropical') || message.includes('island') || message.includes('maldives') || message.includes('caribbean')) {
      return `🏖️ Paradise found! Here are some breathtaking tropical destinations:

**Maldives - Ultimate Luxury**
• Overwater bungalows with glass floors
• Private beach dinners under the stars
• Snorkeling with manta rays and whale sharks
• Sunset dolphin cruises

**Caribbean Islands**
• Barbados: Pink sand beaches and rum tours
• St. Lucia: Dramatic pitons and rainforest hikes
• Turks & Caicos: World-class diving and conch bars

**Activities I recommend:**
• Scuba diving in coral gardens
• Catamaran sailing at golden hour
• Beach yoga and spa treatments
• Local cooking classes with fresh seafood

What type of water activities interest you most? Or would you prefer a more relaxed, spa-focused retreat?`;
    }
    
    if (message.includes('adventure') || message.includes('hiking') || message.includes('mountain') || message.includes('outdoor')) {
      return `⛰️ Ready for an adrenaline-packed adventure? Here are epic destinations:

**Patagonia (Chile/Argentina)**
• Trek the famous W Circuit in Torres del Paine
• Glacier hiking on Perito Moreno
• Wild camping under starlit skies
• Wildlife spotting: condors, guanacos, pumas

**Nepal - Himalayan Adventure**
• Everest Base Camp trek (14 days)
• Annapurna Circuit with stunning mountain views
• Cultural immersion in local tea houses
• Sunrise from Poon Hill viewpoint

**New Zealand - Thrill Seeker's Paradise**
• Bungee jumping in Queenstown
• Milford Sound kayaking
• Skydiving over Lake Taupo
• Hiking the Routeburn Track

What's your fitness level and how many days would you like to spend on outdoor activities?`;
    }
    
    if (message.includes('food') || message.includes('cuisine') || message.includes('restaurant') || message.includes('culinary')) {
      return `🍜 A culinary journey around the world! Here are foodie paradise destinations:

**Thailand - Street Food Heaven**
• Bangkok food tours through Chinatown
• Cooking classes in Chiang Mai
• Fresh seafood on Koh Samui beaches
• Visit floating markets for tropical fruits

**Italy - Authentic Flavors**
• Pasta making workshops in Tuscany
• Wine tours through Chianti vineyards
• Pizza masterclasses in Naples
• Truffle hunting in Piedmont

**Peru - Ancient & Modern Fusion**
• Ceviche preparation in Lima
• Quinoa farming experiences in Sacred Valley
• Traditional pachamanca earth-oven meals
• Pisco tasting in Cusco

Would you prefer hands-on cooking experiences, fine dining, or authentic street food adventures?`;
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return `💰 Amazing travel doesn't have to break the bank! Here are budget-friendly gems:

**Southeast Asia - Incredible Value**
• Vietnam: $30-40/day including accommodation
• Cambodia: Temples of Angkor + local cuisine
• Laos: Peaceful river towns and waterfalls
• Thailand: Islands, culture, and street food

**Eastern Europe - Rich Culture, Low Cost**
• Prague: Fairy-tale architecture and cheap beer
• Budapest: Thermal baths and ruin bars
• Krakow: Medieval charm and hearty cuisine
• Sofia: Hidden gem with mountain access

**Money-Saving Tips:**
• Travel during shoulder seasons (May-June, Sept-Oct)
• Use local transportation and eat where locals do
• Stay in hostels or guesthouses
• Look for free walking tours and city passes

What's your approximate daily budget, and are you comfortable with hostels or prefer private accommodation?`;
    }
    
    // Default responses for general queries
    const responses = [
      "That sounds like an amazing trip idea! Could you tell me more about what type of experience you're looking for? Are you interested in cultural immersion, outdoor adventures, relaxation, or perhaps a mix of everything?",
      
      "I'd love to help you plan something special! What's your ideal trip duration, and do you have any specific interests like history, cuisine, nature, or nightlife that I should know about?",
      
      "Exciting! To give you the best recommendations, could you share: your travel dates, group size, budget range, and any must-see destinations or activities on your wishlist?",
      
      "Perfect! I have so many ideas brewing. Are you looking for a romantic getaway, family adventure, solo journey, or group expedition? And what climate do you prefer - tropical, temperate, or somewhere cooler?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
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
    <>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
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
    </>
  );
};

// Forward ref to allow parent to call clearConversation
const ref = React.createRef<{ clearConversation: () => void }>();

export default Chat;
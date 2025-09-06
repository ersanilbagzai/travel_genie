import React, { useState, useRef, useEffect } from 'react';
import { Compass } from 'lucide-react';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Chat from './components/Chat';
import Itinerary from './components/Itinerary';
import Contact from './components/Contact';
import HowItWorks from './components/HowItWorks';
import { authHelpers } from './lib/supabase';
import type { User as UserProfile } from './lib/supabase';
import type { ItineraryData } from './components/Itinerary';
import HeroSection from './components/HeroSection'; // New import

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const chatRef = useRef<{ clearConversation: () => void }>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null); // New ref for main content

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0); // Scroll to top on component mount
    }, 0);
    history.scrollRestoration = 'manual'; // Disable browser's scroll restoration
    const checkSession = async () => {
      try {
        const { profile } = await authHelpers.getCurrentUser();
        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleAuthSuccess = (userData: UserProfile) => {
    setUser(userData);
  };

  const handleSignOut = async () => {
    try {
      await authHelpers.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleItineraryReceived = (itinerary: ItineraryData) => {
    setItineraryData(itinerary);
  };

  const handleContactClick = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
      // Adjust scroll position to account for sticky header (Header height is 4rem = 64px)
      setTimeout(() => {
        window.scrollBy(0, -64); 
      }, 600); // Delay to allow smooth scroll to complete
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Compass className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading TravelGenie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        user={user}
        onSignOut={handleSignOut}
        onContactClick={handleContactClick}
      />
      <HeroSection onScrollButtonClick={handleScrollToContent} /> {/* Pass scroll handler */}
      <main ref={mainContentRef}> {/* Apply ref to main */}
        <div className="flex h-[90vh] bg-white"> {/* Re-added flex, changed height to h-[90vh] */}
          <div className="w-1/2 h-full"> {/* Re-added w-1/2 */}
            <Chat 
              ref={chatRef} 
              user={user} 
              onItineraryReceived={handleItineraryReceived}
            />
          </div>
          <div className="w-1/2 h-full border-l border-gray-200/50"> {/* Re-added w-1/2 and border-l */}
            <Itinerary data={itineraryData} />
          </div>
        </div>
        <HowItWorks />
        <Contact ref={contactRef} />
      </main>
    </div>
  );
}

export default App;

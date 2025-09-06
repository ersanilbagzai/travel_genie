import React, { useState, useRef, useEffect } from 'react';
import { Compass } from 'lucide-react';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Chat from './components/Chat';
import { authHelpers } from './lib/supabase';
import type { User as UserProfile } from './lib/supabase';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef<{ clearConversation: () => void }>(null);

  // Check for existing session on app load
  useEffect(() => {
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

  const handleNewChat = () => {
    chatRef.current?.clearConversation();
  };

  // Show loading spinner while checking session
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

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Header 
        user={user}
        onSignOut={handleSignOut}
        onNewChat={handleNewChat}
      />
      <Chat ref={chatRef} user={user} />
    </div>
  );
}

export default App;
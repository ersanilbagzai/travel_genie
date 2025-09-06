import React from 'react';
import { RotateCcw, Compass } from 'lucide-react';
import type { User } from '../lib/supabase';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, onNewChat }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TravelGenie</h1>
            <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewChat}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={onSignOut}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
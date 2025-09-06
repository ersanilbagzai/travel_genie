import React from 'react';
import { Compass, LogOut, Mail } from 'lucide-react';
import type { User } from '../lib/supabase';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, onContactClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TravelGenie</h1>
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user.name}</span>!
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onContactClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import homeImage from '../assets/images/home_image.png';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollButtonClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollButtonClick }) => {
  return (
    <div 
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-center text-white pt-16"
      style={{ backgroundImage: `url(${homeImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-4">
        <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
        <p className="text-xl">Your AI-Powered Travel Companion</p>
      </div>
      <button
        onClick={onScrollButtonClick}
        className="relative z-10 mt-8 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-300"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </div>
  );
};

export default HeroSection;

import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-blue-50/50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="pr-8">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
              Your Personal Travel AI
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Start chatting with us.
              <br/><br/>
              Ask us for suggestions for any destination or ask us for an entire itinerary. Be as specific as you can about the types of experiences that you like or take our quiz to determine your travel style.
            </p>
          </div>
          <div className="hidden md:block">
            <img 
              src="src/assets/images/hot_it_works_image.png" 
              alt="Happy traveler" 
              className="rounded-2xl shadow-xl"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

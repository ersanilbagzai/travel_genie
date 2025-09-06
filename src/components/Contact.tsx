import React, { useState, forwardRef } from 'react';
import { Linkedin, Mail } from 'lucide-react';

const Contact = forwardRef<HTMLDivElement>((props, ref) => {
  const [copied, setCopied] = useState(false);
  const email = 'contact@travelgenie.app';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={ref} className="bg-white/80 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Contact Us</h2>
        <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          <a 
            href="https://www.linkedin.com/company/travelgenie" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <Linkedin className="w-12 h-12 text-blue-700 mb-4" />
            <span className="font-semibold text-lg text-gray-800">Follow on LinkedIn</span>
          </a>
          
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md">
            <Mail className="w-12 h-12 text-gray-600 mb-4" />
            <span className="font-semibold text-lg text-gray-800 mb-2">{email}</span>
            <button onClick={handleCopyEmail} className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
              {copied ? 'Copied!' : 'Copy Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Contact;

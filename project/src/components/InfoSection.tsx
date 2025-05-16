import React, { useState } from 'react';
import { getRandomSampleUrls } from '../utils/phishingDetection';
import { Book, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface InfoSectionProps {
  onExampleSelect: (url: string) => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({ onExampleSelect }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('about');
  const exampleUrls = getRandomSampleUrls();
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-6">
      {/* About Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('about')}
          className="w-full px-6 py-4 text-left focus:outline-none"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">About Phishing Detection</h3>
            </div>
            {expandedSection === 'about' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {expandedSection === 'about' && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">
              Phishing is a type of online scam where criminals impersonate legitimate organizations via email, text message, advertisement, or other means to steal sensitive information. This tool helps you identify potential phishing attempts by analyzing URLs for common indicators.
            </p>
            <p className="text-sm text-gray-600">
              While our tool can help identify many phishing attempts, no detection system is perfect. Always exercise caution when clicking links or providing personal information online.
            </p>
          </div>
        )}
      </div>
      
      {/* Example URLs Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('examples')}
          className="w-full px-6 py-4 text-left focus:outline-none"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Example URLs to Test</h3>
            </div>
            {expandedSection === 'examples' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {expandedSection === 'examples' && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">
              Click on any of these example URLs to test our phishing detection system. Some are legitimate websites, while others are examples of phishing URLs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exampleUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => onExampleSelect(url)}
                  className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline truncate"
                >
                  {url}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 italic mt-3">
              Note: These are for demonstration purposes only. No actual phishing sites are linked.
            </p>
          </div>
        )}
      </div>
      
      {/* Safety Tips Section */}
      <div>
        <button
          onClick={() => toggleSection('tips')}
          className="w-full px-6 py-4 text-left focus:outline-none"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Phishing Safety Tips</h3>
            </div>
            {expandedSection === 'tips' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {expandedSection === 'tips' && (
          <div className="px-6 pb-4">
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
              <li>Always check the URL before clicking on links in emails or messages</li>
              <li>Be suspicious of emails or messages with urgent requests or threats</li>
              <li>Hover over links to see the actual URL before clicking</li>
              <li>Look for poor grammar or spelling in emails or on websites</li>
              <li>Verify requests for personal information by contacting the organization directly using their official contact information</li>
              <li>Use multi-factor authentication whenever possible</li>
              <li>Keep your software and browsers updated to protect against security vulnerabilities</li>
              <li>Use a password manager to generate and store strong, unique passwords</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;
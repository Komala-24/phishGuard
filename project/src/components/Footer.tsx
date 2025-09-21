import React from 'react';
import { Shield} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-secondary text-dark-text py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 mr-2" />
            <span className="text-xl font-semibold">PhishGuard</span>
          </div>
          
        
          <div className="text-sm text-dark-accent">
            &copy; {new Date().getFullYear()} PhishGuard. All rights reserved.
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-dark-accent/30 text-center text-sm text-dark-accent">
          <p>
            This tool is for educational purposes only. Always exercise caution when browsing online.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
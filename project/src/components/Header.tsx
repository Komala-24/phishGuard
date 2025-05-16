import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#10141a] text-[#39ff14] shadow-lg border-b-2 border-[#00fff7]">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-8 w-8 mr-3 text-[#00fff7] neon-glow" />
            <h1 className="text-2xl font-bold font-mono tracking-widest neon-glow flicker">
              PhishGuard
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
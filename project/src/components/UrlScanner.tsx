import React, { useState } from 'react';
import { ScanResult } from '../types';
import { predictPhishing } from '../utils/mlPhishing';
import { AlertTriangle, CheckCircle, Shield, ExternalLink } from 'lucide-react';

interface UrlScannerProps {
  onScanComplete: (url: string, result: ScanResult) => void;
}

const UrlScanner: React.FC<UrlScannerProps> = ({ onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      setScanning(true);
      setError('');
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'http://' + normalizedUrl;
      }
      const { isPhishing, confidence, indicators } = await predictPhishing(normalizedUrl);
      const result: ScanResult = {
        isPhishing,
        url: normalizedUrl,
        severity: isPhishing ? 'high' : 'safe',
        confidence,
        indicators,
        suggestions: isPhishing
          ? ['Do not enter your credentials.', 'Close this site immediately.', 'Report this URL.']
          : ['No action needed.'],
      };

      setTimeout(() => {
        onScanComplete(normalizedUrl, result);
        setScanning(false);
      }, 1500);
    } catch (err) {
      setError('An error occurred while scanning the URL');
      setScanning(false);
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#181f2a] rounded-xl shadow-lg overflow-hidden p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-[#39ff14] mr-3" />
        <h2 className="text-2xl font-bold text-[#39ff14] font-mono tracking-wide">URL Phishing Scanner</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {['example.com', 'paypal-login.com', 'goog1e.com', 'secure-bank.tk'].map(example => (
            <button
              key={example}
              type="button"
              className="px-2 py-1 bg-[#232b39] text-[#39ff14] rounded hover:bg-[#39ff14]/10 border border-[#39ff14] transition-colors text-xs font-mono"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="url" className="block text-sm font-medium text-[#00fff7] mb-1 font-mono">
              Enter website URL or link to check
            </label>
            <input
              type="text"
              id="url"
              placeholder="example.com or https://example.com"
              className="w-full px-4 py-3 border border-[#39ff14] bg-[#10141a] text-[#39ff14] rounded-lg focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] font-mono"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && <p className="mt-1 text-sm text-red-400 font-mono">{error}</p>}
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={scanning}
              className={`px-6 py-3 rounded-lg font-medium font-mono text-[#10141a] ${
                scanning 
                  ? 'bg-[#39ff14]/60 cursor-not-allowed' 
                  : 'bg-[#39ff14] hover:bg-[#00fff7] hover:text-[#181f2a] transition-colors'
              }`}
            >
              {scanning ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#10141a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </span>
              ) : (
                'Scan URL'
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-[#232b39] p-4 rounded-lg border border-[#00fff7]">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-[#ff00c8] mr-2" />
          <h3 className="text-sm font-medium text-[#00fff7] font-mono">How to stay safe online</h3>
        </div>
        <ul className="text-sm text-[#00fff7] space-y-1 ml-7 list-disc font-mono">
          <li>Always check URLs before clicking</li>
          <li>Be suspicious of unexpected emails or messages</li>
          <li>Don't share personal information on suspicious sites</li>
          <li>Look for HTTPS and security indicators</li>
        </ul>
      </div>
    </div>
  );
};

export default UrlScanner;
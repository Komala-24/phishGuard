import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UrlScanner from './components/UrlScanner';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import InfoSection from './components/InfoSection';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScanResult, ScanHistory } from './types';

function App() {
  const [currentScan, setCurrentScan] = useState<{ url: string; result: ScanResult } | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [scanCount, setScanCount] = useState(0);

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('phishingHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history from localStorage');
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('phishingHistory', JSON.stringify(history));
  }, [history]);

  const handleScanComplete = (url: string, result: ScanResult) => {
    const newScan = { url, result };
    setCurrentScan(newScan);
    
    // Add to history
    const newHistoryItem: ScanHistory = {
      id: uuidv4(),
      url,
      result,
      date: new Date().toISOString(), // <-- This is correct
    };
    
    setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 19)]);
    setScanCount(prevCount => prevCount + 1);
  };

  const handleSelectFromHistory = (item: ScanHistory) => {
    setCurrentScan({ url: item.url, result: item.result });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  const handleExampleSelect = (url: string) => {
    // Just set the URL value to be scanned
    const urlScannerInput = document.getElementById('url') as HTMLInputElement;
    if (urlScannerInput) {
      urlScannerInput.value = url;
      
      // Create a new input event
      const event = new Event('input', { bubbles: true });
      urlScannerInput.dispatchEvent(event);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl font-bold text-center text-dark-text mb-3">
            Protect Yourself From Phishing Attacks
          </h1>
          <p className="text-xl text-center text-dark-accent max-w-2xl">
            Check suspicious links and websites before you click. Our intelligent scanner analyzes URLs for signs of phishing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UrlScanner onScanComplete={handleScanComplete} />
            
            {currentScan && (
              <ResultCard url={currentScan.url} result={currentScan.result} />
            )}
            
            <InfoSection onExampleSelect={handleExampleSelect} />
          </div>
          
          <div>
            <HistoryList
              history={history} 
              onSelect={handleSelectFromHistory} 
              onClear={handleClearHistory}
              onDelete={handleDeleteHistoryItem}
            />
            {scanCount > 0 && (
              <div className="mt-6 bg-dark-secondary rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-dark-text mb-2">Scan Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dark-accent rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{scanCount}</p>
                    <p className="text-sm text-dark-accent">Total Scans</p>
                  </div>
                  <div className="border border-dark-accent rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">
                      {history.filter(item => item.result.isPhishing).length}
                    </p>
                    <p className="text-sm text-dark-accent">Phishing Detected</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
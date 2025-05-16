import React from 'react';
import { ScanHistory } from '../types';
import { Clock, Trash2, Shield, AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';

interface HistoryListProps {
  history: ScanHistory[];
  onSelect: (item: ScanHistory) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Scan History</h3>
        </div>
        <p className="text-gray-500 text-sm italic">No scans in history yet. Scan a URL to get started.</p>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertOctagon className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown time';
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-3xl mx-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Scan History</h3>
        </div>
        <button 
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {history.map((item) => (
          <li 
            key={item.id}
            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-center">
              <div 
                className="flex-grow overflow-hidden"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center mb-1">
                  {getSeverityIcon(item.result.severity)}
                  <span className="ml-2 text-sm font-medium truncate">
                    {formatUrl(item.url)}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-500">
              {item.date ? new Date(item.date).toLocaleString() : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;


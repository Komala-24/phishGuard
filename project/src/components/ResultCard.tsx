import React from 'react';
import { ScanResult } from '../types';
import { Shield, AlertTriangle, AlertOctagon, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultCardProps {
  url: string;
  result: ScanResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ url, result }) => {
  const [expanded, setExpanded] = React.useState(true);
  
  // Define colors and icons based on severity
  const getSeverityDetails = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          title: 'High Risk - Phishing Detected',
          progressColor: 'bg-red-600',
        };
      case 'medium':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
          title: 'Medium Risk - Potentially Dangerous',
          progressColor: 'bg-amber-500',
        };
      case 'low':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          title: 'Low Risk - Exercise Caution',
          progressColor: 'bg-yellow-500',
        };
      default:
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          title: 'Safe - No Phishing Detected',
          progressColor: 'bg-green-600',
        };
    }
  };

  const severityDetails = getSeverityDetails(result.severity);

  const formatUrl = (url: string) => {
    // Add http if missing
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname + (urlObj.search || '');
    } catch (e) {
      return url;
    }
  };
  
  const displayUrl = formatUrl(url);

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-xl shadow-md overflow-hidden mb-6 border ${severityDetails.borderColor} ${severityDetails.bgColor}`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {severityDetails.icon}
            <h3 className={`ml-2 text-lg font-semibold ${severityDetails.textColor}`}>
              {severityDetails.title}
            </h3>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600 truncate">
            <span className="font-medium">URL:</span> {displayUrl}
          </p>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Confidence Score</span>
            <span className="text-xs font-medium text-gray-700">{result.confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${severityDetails.progressColor} h-2 rounded-full`} 
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="p-5 bg-white">
          {/* Detected Indicators */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Detected Indicators</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(result.indicators || []).map((indicator, index) => (
                <li key={index} className="text-sm text-gray-700">{indicator}</li>
              ))}
            </ul>
          </div>
          
          {/* Remediation Suggestions */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recommended Actions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(result.suggestions || []).map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Phishing Detection Result */}
      <div className="p-5">
        {result.isPhishing ? (
          <div className="text-threat-critical font-bold">Phishing Detected!</div>
        ) : (
          <div className="text-threat-safe font-bold">No Phishing Detected</div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
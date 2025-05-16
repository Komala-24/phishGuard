import { ScanResult } from '../types';
import { predictSeverity } from './mlModel';
import { analyzeThreatType, determineOrigin } from './threatIntel';

// Common phishing patterns
const PHISHING_PATTERNS = {
  paypal: {
    keywords: ['paypa1', 'paypaI', 'peypal', 'payp', 'paypal-secure', 'paypal.com-'],
    domains: ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'],
  },
  suspicious: {
    characters: ['1', 'l', 'I', '0', 'O', '5', 'S'],
    patterns: [
      /p[a@]yp[a@]l/i,
      /p[a@]yp[a@]l?[-_.]?[sv]erif[yi]/i,
      /secure[0-9]*/i,
    ]
  }
};

// Feature extraction for ML model
const extractFeatures = (url: string): number[] => {
  const features = new Array(20).fill(0);
  
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Domain length
    features[0] = hostname.length / 100;
    
    // Number of dots
    features[1] = (hostname.match(/\./g) || []).length / 5;
    
    // Number of special characters
    features[2] = (hostname.match(/[^a-zA-Z0-9.]/g) || []).length / 5;
    
    // Path length
    features[3] = parsedUrl.pathname.length / 100;
    
    // Query parameters count
    features[4] = parsedUrl.searchParams.size / 10;
    
    // PayPal specific features
    features[5] = PHISHING_PATTERNS.paypal.keywords.some(k => hostname.includes(k)) ? 1 : 0;
    features[6] = PHISHING_PATTERNS.paypal.domains.some(d => hostname.endsWith(d)) ? 1 : 0;
    
    // Suspicious character substitutions
    features[7] = PHISHING_PATTERNS.suspicious.characters.some(c => hostname.includes(c)) ? 1 : 0;
    
    // Suspicious patterns
    features[8] = PHISHING_PATTERNS.suspicious.patterns.some(p => p.test(hostname)) ? 1 : 0;
    
    // Brand name with numbers
    features[9] = /paypal[0-9]+/.test(hostname) ? 1 : 0;
    
  } catch (error) {
    console.error('Error extracting features:', error);
    // Set high-risk features on error
    features[0] = 1;
    features[7] = 1;
    features[8] = 1;
  }
  
  return features;
};

export const analyzeUrl = async (url: string): Promise<ScanResult> => {
  // Extract features for ML prediction
  const features = extractFeatures(url);
  
  // Perform quick pattern-based check for obvious phishing
  const isObviousPhishing = PHISHING_PATTERNS.paypal.keywords.some(k => url.toLowerCase().includes(k));
  
  // Get ML prediction
  const prediction = await predictSeverity(features);
  
  // Override prediction for obvious phishing
  if (isObviousPhishing) {
    prediction.severity = 'high';
    prediction.confidence = 95;
  }
  
  // Get threat intelligence
  const threatData = analyzeThreatType(url, url);
  const origin = determineOrigin(url, {});
  
  // Build indicators list
  const indicators = [
    ...threatData.indicators,
    `Origin: ${origin}`,
    `Threat Type: ${threatData.type}`
  ];
  
  // Add specific indicators for PayPal phishing
  if (url.toLowerCase().includes('paypa1')) {
    indicators.push(
      'Suspicious character substitution detected (1 instead of l)',
      'Domain attempts to mimic PayPal',
      'High likelihood of credential theft attempt'
    );
  }
  
  return {
    isPhishing: prediction.severity !== 'safe',
    severity: prediction.severity,
    confidence: prediction.confidence,
    indicators,
    suggestions: [
      ...threatData.mitigation,
      'Report this phishing attempt to PayPal',
      'Check the official PayPal site for security guidelines'
    ],
    timestamp: new Date().toISOString(),
    threatData: {
      ...threatData,
      origin,
    }
  };
};

export const getRandomSampleUrls = (): string[] => {
  return [
    'google.com',
    'amazon.com',
    'g00gle-security.tk',
    'paypal-secure-login.xyz',
    'facebook.com',
    'secure-banking-login-verification.ml',
    'microsoft-verify-account.ga',
    'appleid-verify-account-information.cf',
    'microsoft.com',
    'banking-secure-login.net',
  ];
};
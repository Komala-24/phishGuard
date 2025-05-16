interface ThreatData {
  type: string;
  description: string;
  indicators: string[];
  payload?: string;
  origin?: string;
  mitigation: string[];
}

const THREAT_DATABASE: Record<string, ThreatData> = {
  'credential-harvest': {
    type: 'Credential Harvesting',
    description: 'Attempts to steal login credentials by impersonating legitimate services',
    indicators: [
      'Suspicious domain name pattern',
      'Brand impersonation detected',
      'Potential credential theft attempt'
    ],
    mitigation: [
      'Do not enter any login credentials',
      'Enable 2FA on your PayPal account',
      'Forward this phishing email to spoof@paypal.com',
      'Delete the phishing email immediately',
      'Check your PayPal account directly through paypal.com'
    ]
  },
  'malware-delivery': {
    type: 'Malware Distribution',
    description: 'Delivers malicious software through downloads or drive-by attacks',
    indicators: ['executable files', 'suspicious downloads', 'browser exploits'],
    mitigation: [
      'Keep software updated',
      'Use antivirus protection',
      'Avoid downloading unexpected files'
    ]
  },
  'financial-fraud': {
    type: 'Financial Fraud',
    description: 'Attempts to steal financial information or conduct unauthorized transactions',
    indicators: [
      'Payment information theft attempt',
      'Financial credentials targeted',
      'Urgent action requested'
    ],
    mitigation: [
      'Never click on links in unexpected financial emails',
      'Always type PayPal.com directly in your browser',
      'Report suspicious activities to PayPal',
      'Check your account for unauthorized activity',
      'Use a password manager for secure credentials'
    ]
  }
};

export const analyzeThreatType = (url: string, content: string): ThreatData => {
  const urlLower = url.toLowerCase();
  
  // Check for PayPal phishing
  if (urlLower.includes('paypa1') || urlLower.includes('paypal')) {
    return {
      ...THREAT_DATABASE['credential-harvest'],
      payload: 'Credential theft form',
      indicators: [
        'PayPal brand impersonation',
        'Suspicious domain name pattern',
        'Character substitution in domain (1 for l)',
        'Credential theft attempt detected'
      ]
    };
  }
  
  // Default threat analysis
  if (content.includes('download') || url.match(/\.(exe|zip|rar|msi)$/i)) {
    return THREAT_DATABASE['malware-delivery'];
  } else if (content.includes('payment') || content.includes('bank')) {
    return THREAT_DATABASE['financial-fraud'];
  }
  
  return THREAT_DATABASE['credential-harvest'];
};

export const determineOrigin = (url: string, headers: Record<string, string>): string => {
  try {
    const urlObj = new URL(url);
    const tld = urlObj.hostname.split('.').pop();
    
    // Check for common country-specific TLDs
    const countryTlds: Record<string, string> = {
      'ru': 'Russia',
      'cn': 'China',
      'ir': 'Iran',
      'br': 'Brazil',
      'in': 'India',
      'com': 'International',
      'net': 'International',
      'org': 'International',
      // Add more country TLDs as needed
    };
    
    return countryTlds[tld!] || 'Unknown Origin';
  } catch (e) {
    return 'Unknown Origin';
  }
};
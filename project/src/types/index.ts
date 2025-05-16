export interface ScanResult {
  isPhishing: boolean;
  severity: 'low' | 'medium' | 'high' | 'safe';
  confidence: number;
  indicators: string[];
  suggestions: string[];
  timestamp: string;
  threatData?: {
    type: string;
    description: string;
    payload?: string;
    origin: string;
    mitigation: string[];
  };
}

export interface ScanHistory {
  url: string;
  result: ScanResult;
  id: string;
}
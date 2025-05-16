import * as tf from '@tensorflow/tfjs';

// Simple feature extraction (for demo)
function extractFeatures(url: string): number[] {
  const domainMatch = url.match(/:\/\/([^\/]+)/);
  const domain = domainMatch ? domainMatch[1] : url;
  const tld = url.split('.').pop() || '';
  const commonTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'in', 'co'];
  const isCommonTLD = commonTLDs.includes(tld);
  const isSuspiciousTLD = !isCommonTLD;
  const suspiciousKeywords = ['login', 'secure', 'verify', 'account', 'update', 'bank', 'paypal', 'apple', 'microsoft'];
  const keywordCount = suspiciousKeywords.reduce((acc, kw) => acc + (url.toLowerCase().includes(kw) ? 1 : 0), 0);
  const uncommonTLDs = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'work', 'support'];
  const isUncommonTLD = uncommonTLDs.includes(tld);

  // Lookalike substitutions
  const lookalikeSubs = [
    { pattern: /1/, letter: 'l' },
    { pattern: /0/, letter: 'o' },
    { pattern: /3/, letter: 'e' },
    { pattern: /5/, letter: 's' },
    { pattern: /@/, letter: 'a' },
    { pattern: /\$/, letter: 's' },
    { pattern: /!/, letter: 'i or l' },
    { pattern: /\)/, letter: 'l' },
  ];
  const lookalikeCount = lookalikeSubs.reduce((acc, sub) => acc + (sub.pattern.test(domain) ? 1 : 0), 0);

  const brands = ['google', 'instagram', 'facebook', 'paypal', 'apple', 'microsoft', 'amazon', 'twitter', 'linkedin', 'youtube'];
  const domainParts = domain.split('.');
  const domainName = domainParts.length > 1 ? domainParts[domainParts.length - 2] : domainParts[0];
  let brandTldMismatch = 0;
  brands.forEach(brand => {
    if (domainName.toLowerCase().includes(brand) && tld !== 'com') {
      brandTldMismatch = 1;
    }
  });

  return [
    url.length,
    (url.match(/\d/g) || []).length,
    (domain.replace(/[a-zA-Z0-9.-]/g, '').length),
    domain.length,
    (url.match(/-/g) || []).length,
    (url.match(/\./g) || []).length,
    url.includes('@') ? 1 : 0,
    keywordCount,
    isUncommonTLD ? 1 : 0,
    lookalikeCount, // <-- new feature
    isSuspiciousTLD ? 1 : 0,
    brandTldMismatch, // <-- new feature
  ];
}

// Dummy ML model (replace with real TensorFlow.js model for production)
export async function predictPhishing(url: string): Promise<{ isPhishing: boolean, confidence: number, indicators: string[] }> {
  const features = extractFeatures(url);
  // [url.length, digitCount, specialCharCount, domainLength, hyphenCount, dotCount, hasAt, keywordCount, isUncommonTLD, lookalikeCount]
  const score =
    features[0] * 0.01 +
    features[1] * 0.7 +
    features[2] * 1.0 +
    features[3] * 0.01 +
    features[4] * 0.5 +
    features[6] * 1.5 +
    features[7] * 1.2 +
    features[8] * 2.0 +
    features[9] * 2.5 + // <-- add extra weight for lookalike tricks
    features[10] * 2.0 +
    features[11] * 3.0; // <-- add weight for brand and TLD mismatch

  const isPhishing = score > 2.5;
  const confidence = Math.min(99, Math.round(score * 20));
  const indicators = [];
  if (features[1] > 0) indicators.push('Domain contains numbers');
  if (features[2] > 0) indicators.push('Domain contains special characters');
  if (features[4] > 0) indicators.push('Domain contains hyphens');
  if (features[6] > 0) indicators.push('URL contains "@" symbol');
  if (features[7] > 0) indicators.push('Suspicious keyword(s) found');
  if (features[8] > 0) indicators.push('Uncommon top-level domain');
  if (features[9] > 0) indicators.push('Domain uses lookalike characters (e.g., 1 for l)');
  if (features[10] > 0) indicators.push(`Uncommon or suspicious top-level domain (.${tld})`);
  if (features[11] > 0) indicators.push('Brand domain uses suspicious TLD (e.g., google.in instead of google.com)');
  if (isPhishing) indicators.push('Detected by ML model');
  return { isPhishing, confidence, indicators };
}
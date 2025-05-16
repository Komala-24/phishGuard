let cachedPhishUrls: Set<string> | null = null;

export async function loadOpenPhishFeed(): Promise<Set<string>> {
  const res = await fetch('http://localhost:3001/api/openphish');
  const text = await res.text();
  const urls = text.split('\n').map(line => line.trim()).filter(Boolean);
  return new Set(urls);
}

export async function checkOpenPhish(url: string): Promise<{ isPhishing: boolean, indicators: string[] }> {
  let indicators: string[] = [];
  let isPhishing = false;

  // Heuristic checks
  const patterns = [
    { keyword: 'login', reason: 'Contains "login" in URL' },
    { keyword: 'update', reason: 'Contains "update" in URL' },
    { keyword: 'amazon', reason: 'Contains "amazon" in URL' },
    { keyword: 'fake', reason: 'Contains "fake" in URL' },
    { keyword: 'secure', reason: 'Contains "secure" in URL' },
    { keyword: 'verify', reason: 'Contains "verify" in URL' },
  ];
  patterns.forEach(p => {
    if (url.toLowerCase().includes(p.keyword)) indicators.push(p.reason);
  });

  // General lookalike check
  indicators.push(...hasLookalikeChars(url));

  // OpenPhish check
  try {
    const phishUrls = await loadOpenPhishFeed();
    if (phishUrls.has(url)) {
      isPhishing = true;
      indicators.push('URL found in OpenPhish feed');
    }
  } catch (e) {
    // Ignore feed errors for now
  }

  // If any indicators found, flag as phishing
  if (indicators.length > 0) isPhishing = true;

  return { isPhishing, indicators };
}

function hasLookalikeChars(url: string): string[] {
  // List of common substitutions
  const substitutions = [
    { pattern: /1/, letter: 'l or i' },
    { pattern: /0/, letter: 'o' },
    { pattern: /3/, letter: 'e' },
    { pattern: /5/, letter: 's' },
    { pattern: /@/, letter: 'a' },
    { pattern: /\$/, letter: 's' },
    { pattern: /!/, letter: 'i or l' },
    // Add more as needed
  ];
  const found: string[] = [];
  substitutions.forEach(sub => {
    if (sub.pattern.test(url)) {
      found.push(`Uses "${url.match(sub.pattern)}" instead of "${sub.letter}"`);
    }
  });
  return found;
}
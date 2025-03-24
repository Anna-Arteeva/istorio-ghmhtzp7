import { type LanguageLevel } from './constants';

// Common articles in different languages
const ARTICLES: Record<string, string[]> = {
  de: ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen'],
  fr: ['le', 'la', 'les', 'l\'', 'un', 'une', 'des', 'du', 'de', 'au', 'aux'],
  es: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'],
  it: ['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una'],
  pt: ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas'],
  nl: ['de', 'het', 'een'],
  ru: ['этот', 'эта', 'это', 'эти'],
  ua: ['цей', 'ця', 'це', 'ці'],
  en: ['the', 'a', 'an'],
};

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

// Calculate similarity ratio between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;
  return (maxLength - levenshteinDistance(str1, str2)) / maxLength;
}

// Clean text by removing articles and word endings
function cleanText(text: string, language: string): string {
  let cleanedText = text.toLowerCase().trim();
  
  // Remove articles
  const languageArticles = ARTICLES[language] || [];
  languageArticles.forEach(article => {
    const articleRegex = new RegExp(`\\b${article}\\b`, 'gi');
    cleanedText = cleanedText.replace(articleRegex, '');
  });
  
  // Remove punctuation and extra spaces
  cleanedText = cleanedText
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Get the base form (remove last 3 characters if word is long enough)
  const words = cleanedText.split(' ').map(word => {
    if (word.length > 4) {
      return word.slice(0, -3);
    }
    return word;
  });

  return words.join(' ');
}

// Find sentences containing keyword with fuzzy matching
export function findSentencesWithKeyword(
  sentences: string[],
  keyword: string,
  language: string,
  similarityThreshold: number = 0.7
): number[] {
  const cleanedKeyword = cleanText(keyword, language);
  
  return sentences.reduce<number[]>((matches, sentence, index) => {
    const words = sentence.split(/\s+/);
    
    // Check each word in the sentence
    const hasMatch = words.some(word => {
      const cleanedWord = cleanText(word, language);
      const similarity = calculateSimilarity(cleanedWord, cleanedKeyword);
      return similarity >= similarityThreshold;
    });

    if (hasMatch) {
      matches.push(index);
    }
    
    return matches;
  }, []);
}
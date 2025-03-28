import { Story, ViewRecord } from './types.ts';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function wasViewedWithinLastThreeDays(storyId: string, viewHistory: ViewRecord[]): boolean {
  const storyViews = viewHistory.filter(record => record.id === storyId && record.type === 'story');
  if (!storyViews.length) return false;

  const latestView = new Date(Math.max(...storyViews.map(view => new Date(view.timestamp).getTime())));
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return latestView > threeDaysAgo;
}

export function getLatestViewTimestamp(storyId: string, viewHistory: ViewRecord[]): Date | null {
  const storyViews = viewHistory.filter(record => record.id === storyId && record.type === 'story');
  if (!storyViews.length) return null;

  return new Date(Math.max(...storyViews.map(view => new Date(view.timestamp).getTime())));
}

export function isWithinLastTwoHours(timestamp: string | null): boolean {
  if (!timestamp) return false;
  
  const visitTime = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  
  return now - visitTime <= twoHoursInMs;
}

export function getAccessibleLevels(userLevel: string): string[] {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const userLevelIndex = levels.indexOf(userLevel);
  return levels.slice(0, userLevelIndex + 1);
}
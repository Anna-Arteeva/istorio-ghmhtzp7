export interface Story {
  id: string;
  type: 'long' | 'short';
  level: string;
  imageUrl: string | null;
  keywords: string[];
  audioUrl?: string;
  translations_json?: Record<string, string>;
  content_json?: Record<string, string>;
  explanations_json?: Record<string, string>;
  gradient?: string;
}

export interface ViewRecord {
  id: string;
  type: 'story' | 'info_card';
  timestamp: string;
}

export interface InfoCard {
  id: string;
  name: string;
  active_days: number;
  content_json: Record<string, {
    title: string;
    description: string;
  }>;
}

export interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string>;
  audio_json: Record<string, string>;
}

export interface FeedParams {
  targetLanguage: string;
  level: string;
  viewHistory: ViewRecord[];
  firstVisit: string | null;
  page: number;
  pageSize?: number;
}

// Define all possible feed item types
export type FeedItemType = 
  | { type: 'story'; data: Story }
  | { type: 'info_card'; data: InfoCard }
  | { type: 'try_badge' }
  | { type: 'keywords_carousel'; data: { ids: string[] } };

export interface FeedResponse {
  items: FeedItemType[];
  keywords: Record<string, Keyword>;
  hasMore: boolean;
  nextPage: number | null;
}
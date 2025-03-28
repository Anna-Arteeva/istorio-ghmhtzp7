import { Story, InfoCard, Keyword, FeedItemType } from './types.ts';
import { shuffleArray, wasViewedWithinLastThreeDays, getLatestViewTimestamp, isWithinLastTwoHours } from './utils.ts';
import type { ViewRecord } from './types.ts';

export function distributeContent(
  stories: Story[],
  infoCards: InfoCard[],
  keywords: Record<string, Keyword>,
  viewHistory: ViewRecord[],
  firstVisit: string | null
): FeedItemType[] {
  if (!stories.length && !infoCards.length) return [];

  const items: FeedItemType[] = [];
  let storyCount = 0;
  let infoCardIndex = 0;
  let storyBuffer: Story[] = [];

  // Handle welcome card
  const welcomeCard = infoCards.find(card => card.name === 'welcome');
  const regularCards = infoCards.filter(card => card.name !== 'welcome');

  if (welcomeCard && isWithinLastTwoHours(firstVisit)) {
    items.push({ type: 'info_card', data: welcomeCard });
    items.push({ type: 'try_badge' });
  }

  // Categorize stories
  const unseenStories = shuffleArray(stories.filter(story => 
    !viewHistory.some(record => record.id === story.id && record.type === 'story')
  ));
  
  const oldSeenStories = shuffleArray(stories.filter(story => {
    const latestView = getLatestViewTimestamp(story.id, viewHistory);
    return latestView && !wasViewedWithinLastThreeDays(story.id, viewHistory);
  }));

  const recentlySeenStories = shuffleArray(stories.filter(story => 
    wasViewedWithinLastThreeDays(story.id, viewHistory)
  ));

  function addKeywordsCarousel() {
    if (storyBuffer.length >= 3) {
      const lastThreeStories = storyBuffer.slice(-3);
      const allKeywords = lastThreeStories.flatMap(story => story.keywords || []);
      
      const uniqueKeywords = [...new Set(allKeywords)];
      const validKeywords = uniqueKeywords
        .filter(id => keywords[id])
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (validKeywords.length > 0) {
        items.push({ type: 'keywords_carousel', data: { ids: validKeywords } });
      }
    }
  }

  function addStory(story: Story) {
    items.push({ type: 'story', data: story });
    storyBuffer.push(story);
    storyCount++;

    // Add info card after every 2 stories
    if (storyCount % 2 === 0 && infoCardIndex < regularCards.length) {
      items.push({ type: 'info_card', data: regularCards[infoCardIndex] });
      infoCardIndex++;
    }

    // Add keywords carousel after every 3 stories
    if (storyCount % 3 === 0) {
      addKeywordsCarousel();
    }
  }

  // Distribute stories in the pattern: 2 unseen, 1 old, 1 recent
  while (unseenStories.length > 0 || oldSeenStories.length > 0 || recentlySeenStories.length > 0) {
    // Add 2 unseen stories if available
    for (let i = 0; i < 2; i++) {
      const story = unseenStories.shift();
      if (story) {
        addStory(story);
      }
    }

    // Add 1 old seen story if available
    const oldStory = oldSeenStories.shift();
    if (oldStory) {
      addStory(oldStory);
    }

    // Add 1 recently seen story if available
    const recentStory = recentlySeenStories.shift();
    if (recentStory) {
      addStory(recentStory);
    }
  }

  return items;
}
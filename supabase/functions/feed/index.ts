// deno-lint-ignore-file no-explicit-any
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

// Import types and utilities
import { distributeContent } from './content-distributor.ts';
import { getAccessibleLevels } from './utils.ts';
import type { FeedParams, Story, FeedResponse } from './types.ts';

const DEFAULT_PAGE_SIZE = 10;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY'); // Use anon key instead of service role key

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
    }

    // Initialize Supabase client with anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { 'Content-Type': 'application/json' },
      },
    });

    // Parse request body
    let params: FeedParams;
    try {
      params = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get accessible levels based on user's level
    const accessibleLevels = getAccessibleLevels(params.level);
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const page = params.page || 1;
    const offset = (page - 1) * pageSize;

    // Fetch stories with pagination
    const { data: storiesData, error: storiesError, count } = await supabase
      .from('stories')
      .select('*', { count: 'exact' })
      .eq('story_status', 'published')
      .in('level', accessibleLevels)
      .range(offset, offset + pageSize - 1);

    if (storiesError) throw storiesError;

    // Filter stories based on target language
    const filteredStories = (storiesData || [])
      .filter(story => {
        const content = story.content_json?.[params.targetLanguage];
        if (!content || typeof content !== 'string' || content.trim() === '') return false;
        if (story.language && story.language !== params.targetLanguage) return false;
        return true;
      })
      .map(story => ({
        id: story.id,
        type: story.type,
        level: story.level,
        imageUrl: story.image_url,
        keywords: story.keywords || [],
        audioUrl: story.audio_json?.[params.targetLanguage] || story.audio_json?.en,
        translations_json: story.translations_json,
        content_json: story.content_json,
        explanations_json: story.explanations_json,
        gradient: story.gradient,
      }));

    // Fetch info cards for the current page
    const { data: infoCards, error: infoCardsError } = await supabase
      .from('info_cards')
      .select('*')
      .order('order', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (infoCardsError) throw infoCardsError;

    // Fetch keywords for the current set of stories
    const keywordIds = new Set<string>();
    filteredStories.forEach(story => {
      story.keywords?.forEach(keyword => keywordIds.add(keyword));
    });

    let keywordsMap = {};
    if (keywordIds.size > 0) {
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('keyword_id, translations_json, audio_json')
        .in('keyword_id', Array.from(keywordIds));

      if (keywordsError) throw keywordsError;

      keywordsMap = (keywordsData || []).reduce((acc, keyword) => {
        acc[keyword.keyword_id] = keyword;
        return acc;
      }, {} as Record<string, any>);
    }

    // Distribute content based on user's view history and preferences
    const distributedItems = distributeContent(
      filteredStories,
      infoCards || [],
      keywordsMap,
      params.viewHistory,
      params.firstVisit
    );

    // Calculate pagination info
    const totalItems = count || 0;
    const hasMore = offset + pageSize < totalItems;
    const nextPage = hasMore ? page + 1 : null;

    const response: FeedResponse = {
      items: distributedItems,
      keywords: keywordsMap,
      hasMore,
      nextPage,
    };

    // Return response with proper CORS headers
    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Feed function error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
});
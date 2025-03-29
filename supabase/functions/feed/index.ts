// deno-lint-ignore-file no-explicit-any
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

// Import types and utilities
import { distributeContent } from './content-distributor.ts';
import { getAccessibleLevels } from './utils.ts';
import type { FeedParams, Story, FeedResponse } from './types.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept, cache-control',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Check for authorization header
    const authHeader = req.headers.get('authorization');
    const apiKey = req.headers.get('apikey');

    if (!authHeader && !apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Missing authorization header',
          details: 'Please provide either Authorization or apikey header'
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate the authorization token
    const token = authHeader?.replace('Bearer ', '') || apiKey;
    if (token !== Deno.env.get('ANON_KEY')) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Invalid authorization token'
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
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

    // Fetch stories
    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select('*')
      .eq('story_status', 'published')
      .in('level', accessibleLevels);

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

    // Fetch info cards
    const { data: infoCards, error: infoCardsError } = await supabase
      .from('info_cards')
      .select('*')
      .order('order', { ascending: true });

    if (infoCardsError) throw infoCardsError;

    // Fetch keywords
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

    const response: FeedResponse = {
      items: distributedItems,
      keywords: keywordsMap,
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
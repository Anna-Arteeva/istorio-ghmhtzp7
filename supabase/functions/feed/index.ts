import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data: stories, error, count } = await supabase
      .from('stories')
      .select('*', { count: 'exact' })
      .eq('story_status', 'published')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        stories,
        hasMore: count ? start + pageSize < count : false,
        total: count
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }
});
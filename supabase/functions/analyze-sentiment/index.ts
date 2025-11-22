import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide an array of texts to analyze' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = await Promise.all(
      texts.map(async (text: string) => {
        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-lite',
              messages: [
                {
                  role: 'system',
                  content: 'You are a sentiment analysis expert. Analyze the given text and respond with ONLY a JSON object in this exact format: {"sentiment": "positive|negative|neutral", "confidence": 0.95}. No other text or explanation.'
                },
                {
                  role: 'user',
                  content: text
                }
              ],
              temperature: 0.3,
              max_tokens: 100,
            }),
          });

          const data = await response.json();
          const content = data.choices[0]?.message?.content || '{"sentiment": "neutral", "confidence": 0.5}';
          
          // Parse the JSON response
          const parsed = JSON.parse(content);
          
          return {
            text: text,
            sentiment: parsed.sentiment || 'neutral',
            confidence: parsed.confidence || 0.5
          };
        } catch (error) {
          console.error('Error analyzing text:', error);
          return {
            text: text,
            sentiment: 'neutral',
            confidence: 0.5
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

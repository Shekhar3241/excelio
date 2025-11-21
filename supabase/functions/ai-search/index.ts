import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT = 10;
const WINDOW_MINUTES = 60;

async function checkRateLimit(
  supabaseClient: any,
  ipAddress: string, 
  endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  
  const { data: existing } = await supabaseClient
    .from('rate_limits')
    .select('request_count, window_start')
    .eq('ip_address', ipAddress)
    .eq('endpoint', endpoint)
    .single();

  if (!existing) {
    await supabaseClient
      .from('rate_limits')
      .insert({ 
        ip_address: ipAddress, 
        endpoint, 
        request_count: 1,
        window_start: new Date()
      });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  const windowStartTime = new Date(existing.window_start);
  
  if (windowStartTime < windowStart) {
    await supabaseClient
      .from('rate_limits')
      .update({ 
        request_count: 1, 
        window_start: new Date() 
      })
      .eq('ip_address', ipAddress)
      .eq('endpoint', endpoint);
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (existing.request_count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await supabaseClient
    .from('rate_limits')
    .update({ request_count: existing.request_count + 1 })
    .eq('ip_address', ipAddress)
    .eq('endpoint', endpoint);

  return { 
    allowed: true, 
    remaining: RATE_LIMIT - existing.request_count - 1 
  };
}

function validateSearchInput(query: any): { valid: boolean; error?: string } {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query is required and must be a string' };
  }
  if (query.trim().length < 3) {
    return { valid: false, error: 'Query must be at least 3 characters' };
  }
  if (query.length > 500) {
    return { valid: false, error: 'Query too long - maximum 500 characters' };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rateLimit = await checkRateLimit(supabaseClient, ipAddress, 'ai-search');
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. You can make 10 requests per hour. Please try again later.',
          retryAfter: 3600 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0'
          } 
        }
      );
    }

    const { query } = await req.json();
    
    const validation = validateSearchInput(query);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an Excel formula expert. Generate COMPLETE Excel formulas with full syntax.

CRITICAL REQUIREMENTS:
1. Start EVERY formula with =
2. Include actual cell references (A1, B2, C1:C10, etc.)
3. Include all arguments inside parentheses
4. NO explanations, NO text, ONLY formulas
5. Return 2-3 formula variations

CORRECT EXAMPLES:
User: "add numbers from column A row 1 to 10"
Your response (ONLY these lines):
=SUM(A1:A10)
=SUMIF(A1:A10,">0")

User: "if A1 greater than 100 show High else Low"
Your response (ONLY these lines):
=IF(A1>100,"High","Low")
=IF(A1>100,"High","Low")

User: "count cells in range B1 to B20"
Your response (ONLY these lines):
=COUNTA(B1:B20)
=COUNT(B1:B20)

WRONG - DO NOT do this:
SUM
Use SUM function
=SUM

RIGHT - Always do this:
=SUM(A1:A10)
=SUM(B:B)

Generate formulas now:`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    
    const formulas = rawContent
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith("=") && line.length > 2);

    if (formulas.length === 0) {
      console.error("No valid formulas found in AI response");
      return new Response(
        JSON.stringify({ 
          formulas: [],
          error: "AI did not return valid formulas. Please try rephrasing your request." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ formulas }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error in ai-search:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ error: "Failed to generate formulas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

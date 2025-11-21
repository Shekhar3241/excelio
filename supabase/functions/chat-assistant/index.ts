import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

function validateChatInput(messages: any): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  if (messages.length === 0) {
    return { valid: false, error: 'At least one message is required' };
  }
  if (messages.length > 50) {
    return { valid: false, error: 'Too many messages - maximum 50' };
  }
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return { valid: false, error: 'Each message must have role and content' };
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    if (typeof msg.content !== 'string' || msg.content.length > 2000) {
      return { valid: false, error: 'Message content too long - maximum 2000 characters' };
    }
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

    const rateLimit = await checkRateLimit(supabaseClient, ipAddress, 'chat-assistant');
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

    const { messages } = await req.json();
    
    const validation = validateChatInput(messages);
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

    const systemPrompt = `You are an Excel formula expert assistant. Help users find the right Excel formulas and answer their Excel-related questions.

Your role:
- Help users find Excel formulas for their specific needs
- Explain how formulas work with clear examples
- Suggest complete formulas with proper syntax (always start with =)
- Provide tips and best practices
- Answer Excel-related questions

When providing formulas:
- Always use complete syntax: =FUNCTION(arguments)
- Include cell references like A1, B2, C1:C10
- Explain what each formula does
- Give real examples

Be conversational, helpful, and concise. Format formulas in code blocks for clarity.`;

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
          ...messages
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
    const reply = data.choices?.[0]?.message?.content || "I apologize, but I could not generate a response.";

    return new Response(
      JSON.stringify({ reply }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error in chat-assistant:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

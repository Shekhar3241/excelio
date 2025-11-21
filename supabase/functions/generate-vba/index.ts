import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

function validateVBAInput(task: any, prompt: any): { valid: boolean; error?: string } {
  if (!task || typeof task !== 'string' || task.length > 100) {
    return { valid: false, error: 'Task is required and must be under 100 characters' };
  }
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }
  if (prompt.length < 10) {
    return { valid: false, error: 'Please provide more details (at least 10 characters)' };
  }
  if (prompt.length > 1000) {
    return { valid: false, error: 'Description too long - maximum 1000 characters' };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
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

    const rateLimit = await checkRateLimit(supabaseClient, ipAddress, 'generate-vba');
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

    const { task, prompt } = await req.json();
    
    const validation = validateVBAInput(task, prompt);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert VBA programmer for Excel. Generate clean, well-commented, production-ready VBA code based on user requests.

Guidelines:
1. Use proper VBA syntax and best practices
2. Include error handling (On Error Resume Next / On Error GoTo ErrorHandler)
3. Add descriptive comments explaining the code
4. Use meaningful variable names
5. Optimize for performance
6. Make code reusable and maintainable
7. Include Option Explicit at the top
8. Return ONLY the VBA code without any markdown formatting or explanations in the code section

After the code, provide a separate explanation section that describes:
- What the code does
- How to use it
- Any prerequisites or setup needed
- Customization options

Format your response as:
CODE:
[VBA code here]

EXPLANATION:
[Explanation here]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Task: ${task}\n\nUser Request: ${prompt}\n\nGenerate VBA code for this automation task.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI gateway request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    const codeParts = aiResponse.split('EXPLANATION:');
    let code = codeParts[0].replace('CODE:', '').trim();
    let explanation = codeParts[1]?.trim() || 'VBA code generated successfully.';

    code = code.replace(/```vba\n?/g, '').replace(/```\n?/g, '').trim();

    return new Response(
      JSON.stringify({ code, explanation }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining)
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-vba:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'Failed to generate VBA code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

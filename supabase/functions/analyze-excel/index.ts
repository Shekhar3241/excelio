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

function validateExcelInput(data: any): { valid: boolean; error?: string } {
  if (!data.fileName || typeof data.fileName !== 'string' || data.fileName.length > 255) {
    return { valid: false, error: 'Invalid file name' };
  }
  if (!Array.isArray(data.sheets) || data.sheets.length > 100) {
    return { valid: false, error: 'Invalid sheets data' };
  }
  if (typeof data.totalFormulas !== 'number' || data.totalFormulas < 0 || data.totalFormulas > 100000) {
    return { valid: false, error: 'Invalid formula count' };
  }
  if (!Array.isArray(data.errors) || data.errors.length > 1000) {
    return { valid: false, error: 'Too many errors to process' };
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

    const rateLimit = await checkRateLimit(supabaseClient, ipAddress, 'analyze-excel');
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

    const requestData = await req.json();
    
    const validation = validateExcelInput(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileName, sheets, totalFormulas, formulasByType, errors } = requestData;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an Excel optimization expert. Analyze the uploaded Excel file and provide actionable suggestions to improve efficiency, reduce errors, and optimize formulas.

Focus on:
1. Formula optimization (volatile functions, circular references, array formulas)
2. Performance improvements
3. Best practices violations
4. Error patterns and how to fix them
5. Alternative approaches that are more efficient

Provide 5-8 specific, actionable suggestions.`;

    const userPrompt = `Analyze this Excel file:
File: ${fileName}
Sheets: ${sheets.join(', ')}
Total Formulas: ${totalFormulas}
Formula Distribution: ${JSON.stringify(formulasByType)}
Errors Found: ${errors.length > 0 ? JSON.stringify(errors) : 'None'}

Provide optimization suggestions.`;

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
          { role: 'user', content: userPrompt }
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
    
    const suggestions = aiResponse
      .split('\n')
      .filter((line: string) => line.match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((s: string) => s.length > 0);

    return new Response(
      JSON.stringify({ suggestions }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining)
        } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-excel:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'Failed to analyze Excel file' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

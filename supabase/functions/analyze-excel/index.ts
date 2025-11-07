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
    const { fileName, sheets, totalFormulas, formulasByType, errors } = await req.json();
    
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
    
    // Parse suggestions from AI response
    const suggestions = aiResponse
      .split('\n')
      .filter((line: string) => line.match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((s: string) => s.length > 0);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-excel function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
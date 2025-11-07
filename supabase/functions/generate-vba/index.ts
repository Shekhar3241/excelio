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
    const { task, prompt } = await req.json();
    
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
    
    // Parse code and explanation
    const codeParts = aiResponse.split('EXPLANATION:');
    let code = codeParts[0].replace('CODE:', '').trim();
    let explanation = codeParts[1]?.trim() || 'VBA code generated successfully.';

    // Remove markdown code blocks if present
    code = code.replace(/```vba\n?/g, '').replace(/```\n?/g, '').trim();

    return new Response(
      JSON.stringify({ code, explanation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-vba function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
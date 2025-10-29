import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an Excel formula expert. Your job is to generate COMPLETE, READY-TO-USE Excel formulas based on user descriptions.

CRITICAL RULES:
1. ALWAYS start formulas with the = sign
2. Generate COMPLETE formulas with proper syntax, cell references, and arguments
3. Use realistic cell references (like A1, B2, C1:C10, etc.)
4. Include all necessary arguments and parameters
5. Return 3-5 different formula variations when possible
6. Format: One formula per line, nothing else

EXAMPLES OF CORRECT OUTPUT:
User: "Sum values in column A"
Response:
=SUM(A1:A10)
=SUM(A:A)
=SUMIF(A1:A10,">0")

User: "If value is greater than 100, show High, else Low"
Response:
=IF(A1>100,"High","Low")
=IF(A2>100,"High","Low")
=IFS(A1>100,"High",A1>50,"Medium",TRUE,"Low")

User: "Calculate average excluding zeros"
Response:
=AVERAGEIF(A1:A10,">0")
=AVERAGE(IF(A1:A10<>0,A1:A10))
=AVERAGEIFS(A1:A10,A1:A10,">0")

Now generate formulas for the user's request below.`;

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
    const suggestions = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", suggestions);
    
    // Split by newlines and clean up
    const formulas = suggestions
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s && s.startsWith("="));
    
    console.log("Parsed formulas:", formulas);

    return new Response(
      JSON.stringify({ formulas }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-search function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

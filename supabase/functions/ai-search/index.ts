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

    const systemPrompt = `You are an Excel formula expert. Generate actual Excel formulas based on user descriptions.

Examples:
- "add numbers in A1 to A10" → =SUM(A1:A10)
- "join text from B1 and B2" → =CONCAT(B1,B2)
- "find value in table" → =VLOOKUP(lookup_value, table_array, col_index, FALSE)
- "count non-empty cells in C1 to C20" → =COUNTA(C1:C20)
- "get today's date" → =TODAY()
- "calculate average of D1 to D15" → =AVERAGE(D1:D15)
- "if A1 is greater than 100, show Yes, else No" → =IF(A1>100,"Yes","No")

Respond with ONLY the Excel formula(s), one per line. Maximum 3 formulas. Include the = sign.`;

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

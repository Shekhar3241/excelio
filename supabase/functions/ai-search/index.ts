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
    
    console.log("=== AI RAW RESPONSE ===");
    console.log(rawContent);
    console.log("=== END RAW RESPONSE ===");
    
    // Split by newlines and clean up - keep only lines starting with =
    const formulas = rawContent
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => {
        // Only keep lines that start with = and have more content
        const isValid = line.startsWith("=") && line.length > 2;
        if (!isValid && line) {
          console.log("Filtered out:", line);
        }
        return isValid;
      });
    
    console.log("=== PARSED FORMULAS ===");
    console.log(JSON.stringify(formulas, null, 2));
    console.log("=== END PARSED ===");

    if (formulas.length === 0) {
      console.error("No valid formulas found in AI response!");
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

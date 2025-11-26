import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { messages, fileContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert data analyst assistant specializing in thorough, accurate analysis of Excel files, PDFs, Word documents, and other data sources.

Your role:
- Perform ACCURATE and DETAILED data analysis based on the actual data provided
- Identify genuine patterns, trends, and anomalies in the data
- Provide specific insights with exact numbers, percentages, and calculations
- Answer questions precisely using the actual data values
- Suggest relevant data visualizations when appropriate
- Explain all calculations step-by-step with the actual numbers from the data
- If data is insufficient or unclear, clearly state what information is missing

CRITICAL RULES:
- NEVER make up or hallucinate data values - only use what's provided
- ALWAYS reference specific rows, columns, or data points when making claims
- ALWAYS show your calculations with actual numbers from the dataset
- If you cannot answer accurately with the given data, say so clearly
- Provide quantitative insights whenever possible (e.g., "Sales increased by 23% from Q1 to Q2")

Format your responses with:
- Clear headings and bullet points
- Tables for numerical comparisons
- Code blocks for formulas or calculations
- Specific data references (e.g., "In row 5, column B shows...")

Be conversational yet precise, insightful yet grounded in the actual data provided.`;

    // Prepare messages with file context if available
    const messagesWithContext = fileContext
      ? [
          { role: "system", content: systemPrompt },
          { role: "system", content: `File Context:\n${fileContext}` },
          ...messages,
        ]
      : [
          { role: "system", content: systemPrompt },
          ...messages,
        ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: messagesWithContext,
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in analyze-data:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ error: "Failed to analyze data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

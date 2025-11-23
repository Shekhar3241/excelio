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
    const { pdfContent, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Converting PDF to PowerPoint:", fileName);

    const systemPrompt = `You are a PDF to PowerPoint converter. Extract content from the PDF and structure it as slides. Each slide should have:
- A clear title
- Key points or content
- Logical grouping of information

Format the output as JSON with this structure:
{
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Return ONLY valid JSON, no explanations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Convert this PDF content to PowerPoint slides:\n\n${pdfContent}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI conversion error:", response.status, errorText);
      throw new Error("Failed to convert PDF");
    }

    const data = await response.json();
    const convertedContent = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON, if it fails, return as text
    let slides;
    try {
      const jsonMatch = convertedContent.match(/\{[\s\S]*\}/);
      slides = jsonMatch ? JSON.parse(jsonMatch[0]) : { slides: [] };
    } catch {
      slides = { slides: [{ title: "Content", content: [convertedContent] }] };
    }

    return new Response(
      JSON.stringify(slides),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PDF to PowerPoint conversion error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

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

    if (!pdfContent) {
      throw new Error("No PDF content provided");
    }

    console.log("Converting PDF to PowerPoint:", fileName);

    // Split content into slides (every 5 paragraphs or section = 1 slide)
    const paragraphs = pdfContent.split('\n\n').filter((p: string) => p.trim().length > 0);
    const slidesData: { title: string; content: string[] }[] = [];
    
    for (let i = 0; i < paragraphs.length; i += 5) {
      const slideParas = paragraphs.slice(i, i + 5);
      const title = slideParas[0]?.substring(0, 50) || `Slide ${slidesData.length + 1}`;
      const content = slideParas.slice(1).map((p: string) => p.substring(0, 100));
      
      slidesData.push({
        title,
        content: content.length > 0 ? content : ['Content from PDF']
      });
    }

    return new Response(
      JSON.stringify({
        slides: slidesData,
        fileName: fileName.replace('.pdf', '.pptx')
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error converting PDF to PowerPoint:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

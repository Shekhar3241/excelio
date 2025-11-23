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

    console.log("Converting PDF to Word:", fileName);

    // Return the content as formatted text
    const formattedContent = pdfContent
      .split('\n\n')
      .map((paragraph: string) => paragraph.trim())
      .filter((p: string) => p.length > 0)
      .join('\n\n');

    return new Response(
      JSON.stringify({
        content: formattedContent,
        fileName: fileName.replace('.pdf', '.docx')
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error converting PDF to Word:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

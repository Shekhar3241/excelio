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
    const { pdfText, fileName } = await req.json();

    if (!pdfText) {
      throw new Error("No PDF text provided");
    }

    console.log("Converting PDF to PowerPoint:", fileName);

    // Split content into slides (every 3 paragraphs = 1 slide)
    const paragraphs = pdfText.split('\n\n').filter((p: string) => p.trim());
    const slides: string[] = [];
    
    for (let i = 0; i < paragraphs.length; i += 3) {
      const slideContent = paragraphs.slice(i, i + 3).join('\n\n');
      slides.push(slideContent);
    }

    // Create a simple PPTX-compatible format (Office Open XML)
    const pptxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    ${slides.map((slide, index) => `
    <p:sldId id="${index + 256}" r:id="rId${index + 2}"/>
    `).join('')}
  </p:sldIdLst>
  ${slides.map((slide, index) => `
  <p:sld>
    <p:cSld>
      <p:spTree>
        <p:sp>
          <p:txBody>
            <a:p>
              <a:r>
                <a:t>${slide.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a:t>
              </a:r>
            </a:p>
          </p:txBody>
        </p:sp>
      </p:spTree>
    </p:cSld>
  </p:sld>
  `).join('')}
</p:presentation>`;

    // Convert to base64
    const base64Content = btoa(unescape(encodeURIComponent(pptxContent)));

    return new Response(
      JSON.stringify({
        content: base64Content,
        fileName: fileName.replace('.pdf', '.pptx'),
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        slideCount: slides.length
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

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

    // Split content into slides
    const paragraphs = pdfContent.split('\n\n').filter((p: string) => p.trim().length > 0);
    
    // Create PPTX XML structure
    const slides: string[] = [];
    
    // Add title slide
    slides.push(createSlide(
      "PDF to PowerPoint",
      [fileName.replace('.pdf', '')],
      true
    ));

    // Add content slides (every 5 paragraphs = 1 slide)
    for (let i = 0; i < paragraphs.length; i += 5) {
      const slideParas = paragraphs.slice(i, i + 5);
      const title = slideParas[0]?.substring(0, 80) || `Slide ${Math.floor(i / 5) + 1}`;
      const content = slideParas.slice(1).map((p: string) => p.substring(0, 200));
      
      slides.push(createSlide(title, content.length > 0 ? content : ['Content from PDF']));
    }

    // Create PPTX structure
    const pptxXml = createPPTXStructure(slides);
    
    // Convert to base64
    const base64Content = btoa(unescape(encodeURIComponent(pptxXml)));

    return new Response(
      JSON.stringify({
        content: base64Content,
        fileName: fileName.replace('.pdf', '.pptx'),
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
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

function createSlide(title: string, content: string[], isTitle = false): string {
  const escapedTitle = escapeXml(title);
  const bulletPoints = content.map(text => `
    <a:p>
      <a:pPr lvl="0">
        <a:buNone/>
      </a:pPr>
      <a:r>
        <a:rPr lang="en-US" sz="1800" dirty="0"/>
        <a:t>${escapeXml(text)}</a:t>
      </a:r>
    </a:p>`).join('');

  if (isTitle) {
    return `
      <p:txBody>
        <a:bodyPr/>
        <a:lstStyle/>
        <a:p>
          <a:pPr algn="ctr"/>
          <a:r>
            <a:rPr lang="en-US" sz="4400" b="1" dirty="0"/>
            <a:t>${escapedTitle}</a:t>
          </a:r>
        </a:p>
        ${bulletPoints}
      </p:txBody>`;
  }

  return `
    <p:txBody>
      <a:bodyPr/>
      <a:lstStyle/>
      <a:p>
        <a:pPr/>
        <a:r>
          <a:rPr lang="en-US" sz="2800" b="1" dirty="0"/>
          <a:t>${escapedTitle}</a:t>
        </a:r>
      </a:p>
      ${bulletPoints}
    </p:txBody>`;
}

function createPPTXStructure(slides: string[]): string {
  const slideContent = slides.map((slide) => `
    <p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" 
           xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
      <p:cSld>
        <p:spTree>
          <p:nvGrpSpPr>
            <p:cNvPr id="1" name=""/>
            <p:cNvGrpSpPr/>
            <p:nvPr/>
          </p:nvGrpSpPr>
          <p:grpSpPr/>
          <p:sp>
            <p:nvSpPr>
              <p:cNvPr id="2" name="Title 1"/>
              <p:cNvSpPr>
                <a:spLocks noGrp="1"/>
              </p:cNvSpPr>
              <p:nvPr>
                <p:ph type="title"/>
              </p:nvPr>
            </p:nvSpPr>
            <p:spPr/>
            ${slide}
          </p:sp>
        </p:spTree>
      </p:cSld>
    </p:sld>`).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" 
                xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  ${slideContent}
</p:presentation>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

    // Split content into paragraphs
    const paragraphs = pdfContent
      .split('\n\n')
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    // Create DOCX XML structure
    const docxXml = createDOCXStructure(paragraphs);
    
    // Convert to base64
    const base64Content = btoa(unescape(encodeURIComponent(docxXml)));

    return new Response(
      JSON.stringify({
        content: base64Content,
        fileName: fileName.replace('.pdf', '.docx'),
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

function createDOCXStructure(paragraphs: string[]): string {
  const paragraphsXml = paragraphs.map((text, index) => {
    const isHeading = text.length < 100 && !text.includes('.') && index === 0;
    const escapedText = escapeXml(text);
    
    if (isHeading) {
      return `
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading1"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:b/>
              <w:sz w:val="32"/>
            </w:rPr>
            <w:t>${escapedText}</w:t>
          </w:r>
        </w:p>`;
    }
    
    return `
      <w:p>
        <w:r>
          <w:rPr>
            <w:sz w:val="24"/>
          </w:rPr>
          <w:t xml:space="preserve">${escapedText}</w:t>
        </w:r>
      </w:p>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraphsXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

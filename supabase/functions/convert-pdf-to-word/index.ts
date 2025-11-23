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

    console.log("Converting PDF to Word:", fileName);

    // Create a simple DOCX-compatible format (Office Open XML)
    const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${pdfText.split('\n\n').map((paragraph: string) => `
    <w:p>
      <w:r>
        <w:t>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</w:t>
      </w:r>
    </w:p>
    `).join('')}
  </w:body>
</w:document>`;

    // Convert to base64
    const base64Content = btoa(unescape(encodeURIComponent(docxContent)));

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

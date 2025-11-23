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
    const { pdfContent, convertTo, fileName } = await req.json();

    if (!pdfContent || !convertTo) {
      throw new Error("Missing required parameters");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Converting PDF to ${convertTo}:`, fileName);

    let systemPrompt = "";
    let userPrompt = "";

    switch (convertTo) {
      case "word":
        systemPrompt = "You are a PDF to Word converter. Convert the provided PDF text into a well-formatted Word document structure with proper headings, paragraphs, and formatting.";
        userPrompt = `Convert this PDF content to a properly formatted Word document:\n\n${pdfContent}`;
        break;
      
      case "markdown":
        systemPrompt = "You are a PDF to Markdown converter. Convert the provided PDF text into clean, well-structured Markdown format.";
        userPrompt = `Convert this PDF content to Markdown:\n\n${pdfContent}`;
        break;
      
      case "html":
        systemPrompt = "You are a PDF to HTML converter. Convert the provided PDF text into semantic, well-structured HTML with proper tags.";
        userPrompt = `Convert this PDF content to HTML:\n\n${pdfContent}`;
        break;
      
      case "text":
        systemPrompt = "You are a PDF to plain text converter. Extract and clean up the text content from the PDF, removing any formatting artifacts.";
        userPrompt = `Clean up this PDF content and convert to plain text:\n\n${pdfContent}`;
        break;
      
      default:
        throw new Error(`Unsupported conversion type: ${convertTo}`);
    }

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const convertedContent = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        content: convertedContent,
        fileName: fileName.replace('.pdf', getFileExtension(convertTo)),
        mimeType: getMimeType(convertTo)
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in AI PDF conversion:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getFileExtension(convertTo: string): string {
  const extensions: Record<string, string> = {
    word: '.docx',
    markdown: '.md',
    html: '.html',
    text: '.txt',
  };
  return extensions[convertTo] || '.txt';
}

function getMimeType(convertTo: string): string {
  const mimeTypes: Record<string, string> = {
    word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    markdown: 'text/markdown',
    html: 'text/html',
    text: 'text/plain',
  };
  return mimeTypes[convertTo] || 'text/plain';
}

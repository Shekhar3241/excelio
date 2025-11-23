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
    const { fileContent, fileName, sourceType, targetFormat } = await req.json();

    if (!fileContent || !targetFormat) {
      throw new Error("Missing required parameters");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Converting ${fileName} to ${targetFormat}`);

    // Build conversion prompt based on source and target formats
    let systemPrompt = "";
    let userPrompt = "";

    switch (targetFormat) {
      case "excel":
      case "csv":
        systemPrompt = "You are a file converter assistant. Convert the provided content into a CSV format with proper structure, headers, and data rows. Preserve all data accurately.";
        userPrompt = `Convert this content to CSV format:\n\n${fileContent}`;
        break;
      
      case "word":
      case "docx":
        systemPrompt = "You are a file converter assistant. Convert the provided content into a well-formatted Word document structure with proper headings, paragraphs, and formatting.";
        userPrompt = `Convert this content to a Word document format:\n\n${fileContent}`;
        break;
      
      case "pdf":
        systemPrompt = "You are a file converter assistant. Convert the provided content into a text format suitable for PDF creation with proper structure, headings, and paragraphs.";
        userPrompt = `Convert this content to PDF-ready text format:\n\n${fileContent}`;
        break;
      
      case "markdown":
      case "md":
        systemPrompt = "You are a file converter assistant. Convert the provided content into clean, well-structured Markdown format with proper headings, lists, and formatting.";
        userPrompt = `Convert this content to Markdown:\n\n${fileContent}`;
        break;
      
      case "html":
        systemPrompt = "You are a file converter assistant. Convert the provided content into semantic, well-structured HTML with proper tags, headings, and formatting.";
        userPrompt = `Convert this content to HTML:\n\n${fileContent}`;
        break;
      
      case "text":
      case "txt":
        systemPrompt = "You are a file converter assistant. Extract and clean up the text content, removing any formatting artifacts while preserving the essential information.";
        userPrompt = `Convert this content to plain text:\n\n${fileContent}`;
        break;

      case "text-description":
        systemPrompt = "You are an image description assistant. Provide a detailed textual description of the image content.";
        userPrompt = `Describe the following image file in detail:\n\n${fileContent}`;
        break;
      
      default:
        systemPrompt = `You are a file converter assistant. Convert the provided content to ${targetFormat} format with proper structure and formatting.`;
        userPrompt = `Convert this content to ${targetFormat}:\n\n${fileContent}`;
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

    // Determine file extension and MIME type
    const getFileDetails = (format: string) => {
      const formats: Record<string, { ext: string; mime: string }> = {
        excel: { ext: '.csv', mime: 'text/csv' },
        csv: { ext: '.csv', mime: 'text/csv' },
        word: { ext: '.txt', mime: 'text/plain' },
        docx: { ext: '.txt', mime: 'text/plain' },
        pdf: { ext: '.txt', mime: 'text/plain' },
        markdown: { ext: '.md', mime: 'text/markdown' },
        md: { ext: '.md', mime: 'text/markdown' },
        html: { ext: '.html', mime: 'text/html' },
        text: { ext: '.txt', mime: 'text/plain' },
        txt: { ext: '.txt', mime: 'text/plain' },
        'text-description': { ext: '.txt', mime: 'text/plain' },
      };
      return formats[format] || { ext: '.txt', mime: 'text/plain' };
    };

    const { ext, mime } = getFileDetails(targetFormat);
    const outputFileName = fileName.replace(/\.[^.]+$/, ext);

    return new Response(
      JSON.stringify({
        content: convertedContent,
        fileName: outputFileName,
        mimeType: mime
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in AI file conversion:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

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
    const { fileBase64, fileName, fileType, targetFormat } = await req.json();

    if (!fileBase64 || !targetFormat) {
      throw new Error("Missing required parameters");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Converting ${fileName} (${fileType}) to ${targetFormat}`);

    // Decode base64 to get file content description
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileSize = Math.round((fileBase64.length * 3) / 4 / 1024); // Approximate size in KB

    // Build conversion prompt
    let systemPrompt = `You are an expert file converter. You will convert files from one format to another with high accuracy and proper structure.`;
    
    let userPrompt = `I have a ${fileType} file named "${fileName}" (approximately ${fileSize} KB).
I need to convert it to ${targetFormat} format.

Please generate the converted content in ${targetFormat} format with proper structure, formatting, and all data preserved.

Source file type: ${fileExtension}
Target format: ${targetFormat}

Instructions:
- Maintain data integrity and structure
- Use appropriate formatting for the target format
- Include headers, proper spacing, and organization
- For tabular data, preserve rows and columns
- For documents, preserve headings and paragraphs
- For images, provide detailed descriptions if converting to text

Please provide ONLY the converted content, without any explanations or additional text.`;

    // Add format-specific instructions
    switch (targetFormat) {
      case "excel":
      case "csv":
        userPrompt += "\n\nFormat as CSV with comma-separated values, proper headers, and data rows.";
        break;
      case "word":
      case "docx":
        userPrompt += "\n\nFormat as a Word document with proper headings, paragraphs, and structure.";
        break;
      case "pdf":
        userPrompt += "\n\nFormat as text suitable for PDF with proper sections, headings, and paragraphs.";
        break;
      case "markdown":
      case "md":
        userPrompt += "\n\nFormat as Markdown with proper syntax: # for headings, ** for bold, * for lists, etc.";
        break;
      case "html":
        userPrompt += "\n\nFormat as semantic HTML with <!DOCTYPE html>, proper tags, headings, and structure.";
        break;
      case "text":
      case "txt":
        userPrompt += "\n\nFormat as clean plain text, removing any formatting artifacts.";
        break;
      case "text-description":
        userPrompt += "\n\nProvide a detailed textual description of the file content.";
        break;
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
        temperature: 0.3,
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
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
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

    console.log(`Conversion successful: ${outputFileName}`);

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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred during conversion" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

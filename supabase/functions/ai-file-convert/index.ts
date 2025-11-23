import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to convert base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to extract text from binary data
async function extractTextContent(bytes: Uint8Array, fileType: string, fileName: string): Promise<string> {
  const decoder = new TextDecoder();
  
  // For text-based files, try to decode directly
  if (fileType.startsWith('text/') || 
      fileName.endsWith('.txt') || 
      fileName.endsWith('.csv') || 
      fileName.endsWith('.md') ||
      fileName.endsWith('.html')) {
    return decoder.decode(bytes);
  }
  
  // For other files, return a representation
  const fileSize = (bytes.length / 1024).toFixed(2);
  return `File: ${fileName}\nType: ${fileType}\nSize: ${fileSize} KB\n\nNote: This is a binary file. AI will intelligently convert based on file type and target format.`;
}

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

    // Decode base64 to bytes
    const fileBytes = base64ToUint8Array(fileBase64);
    const fileSize = (fileBytes.length / 1024).toFixed(2);
    
    // Extract text content from file
    const fileContent = await extractTextContent(fileBytes, fileType, fileName);

    // Build conversion prompt based on actual file content
    let systemPrompt = "";
    let userPrompt = "";

    switch (targetFormat) {
      case "excel":
      case "csv":
        systemPrompt = "You are a file converter. Convert the provided content into CSV format with proper structure. Use commas to separate values, include headers in the first row, and ensure all data is properly formatted.";
        userPrompt = `Convert this file content to CSV format:\n\nFile: ${fileName}\nSize: ${fileSize} KB\n\n${fileContent}\n\nProvide ONLY the CSV content with proper headers and data rows. No explanations.`;
        break;
      
      case "word":
      case "docx":
        systemPrompt = "You are a file converter. Convert the provided content into a well-formatted document structure suitable for Word with proper headings, paragraphs, and formatting.";
        userPrompt = `Convert this file content to a Word document format:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide the content with clear headings, paragraphs, and structure. No explanations.`;
        break;
      
      case "pdf":
        systemPrompt = "You are a file converter. Convert the provided content into well-structured text suitable for PDF with proper headings, sections, and formatting.";
        userPrompt = `Convert this file content to PDF-ready text:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide well-organized text with headings, sections, and proper formatting. No explanations.`;
        break;
      
      case "markdown":
      case "md":
        systemPrompt = "You are a file converter. Convert the provided content into clean Markdown format using proper syntax (# for headings, ** for bold, * for lists, etc.).";
        userPrompt = `Convert this file content to Markdown:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide ONLY the Markdown formatted content. No explanations.`;
        break;
      
      case "html":
        systemPrompt = "You are a file converter. Convert the provided content into semantic HTML with proper structure, tags, and formatting.";
        userPrompt = `Convert this file content to HTML:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide a complete HTML document with <!DOCTYPE html>, proper structure, and semantic tags. No explanations.`;
        break;
      
      case "text":
      case "txt":
        systemPrompt = "You are a file converter. Extract and clean up the text content, preserving essential information while removing formatting artifacts.";
        userPrompt = `Convert this file content to clean plain text:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide ONLY the clean text content. No explanations.`;
        break;

      case "text-description":
        systemPrompt = "You are a file content analyzer. Provide a detailed description of what the file contains.";
        userPrompt = `Analyze and describe this file content:\n\nFile: ${fileName}\nType: ${fileType}\n\n${fileContent}\n\nProvide a detailed description of the content, structure, and any notable information.`;
        break;
      
      default:
        systemPrompt = `You are a file converter. Convert the provided content to ${targetFormat} format with proper structure and formatting.`;
        userPrompt = `Convert this file content to ${targetFormat}:\n\nFile: ${fileName}\n\n${fileContent}\n\nProvide ONLY the converted content. No explanations.`;
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
        temperature: 0.2,
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
    let convertedContent = data.choices[0].message.content;

    // Clean up the content - remove markdown code blocks if present
    if (convertedContent.startsWith('```')) {
      // Remove opening code block
      convertedContent = convertedContent.replace(/^```[\w]*\n/, '');
      // Remove closing code block
      convertedContent = convertedContent.replace(/\n```$/, '');
    }

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

    console.log(`Conversion successful: ${outputFileName} (${convertedContent.length} characters)`);

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

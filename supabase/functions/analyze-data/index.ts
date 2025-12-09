import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { messages, fileContext, action } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Action-specific prompts
    let actionPrompt = "";
    if (action === "summarize") {
      actionPrompt = `
TASK: Provide a comprehensive summary of the uploaded document(s).

Structure your summary as follows:
## 📄 Document Overview
Brief description of what the document is about.

## 🎯 Key Points
- Main point 1
- Main point 2
- Main point 3
(list the most important takeaways)

## 📊 Summary
A concise 2-3 paragraph summary covering the essential content.

## 💡 Notable Details
Any specific data, figures, or important details worth highlighting.
`;
    } else if (action === "extract") {
      actionPrompt = `
TASK: Extract and organize key information from the uploaded document(s).

Structure your extraction as follows:
## 📋 Extracted Information

### Key Data Points
| Category | Information |
|----------|-------------|
| (extract relevant data into a table) |

### Important Figures & Numbers
- List any statistics, percentages, amounts, dates mentioned

### Names & Entities
- People, organizations, locations mentioned

### Action Items / Conclusions
- Any recommendations, conclusions, or action items in the document
`;
    }

    const systemPrompt = `You are Data.chat, an intelligent document analysis assistant similar to ChatPDF. You specialize in answering questions about uploaded documents and providing insightful analysis.

Your capabilities:
1. **Conversational Q&A**: Answer natural language questions about document content with precise, contextual responses
2. **Document Summarization**: Create clear, structured summaries of complex documents
3. **Information Extraction**: Find and organize specific data, key insights, and important details
4. **Multi-Document Analysis**: Analyze and compare information across multiple uploaded files

${actionPrompt}

RESPONSE GUIDELINES:
- Be conversational and helpful, like a knowledgeable assistant
- Reference specific parts of the document when answering questions
- Use exact quotes when relevant (with "..." for omissions)
- Provide page/section references when available
- If information isn't in the document, clearly say so
- For numerical data, always show the actual values from the document

FORMAT YOUR RESPONSES WITH PROPER MARKDOWN:
- Use ## and ### for headings and subheadings
- Use bullet points (-) for lists
- Use numbered lists (1. 2. 3.) for ordered steps
- For tables, ALWAYS use proper markdown table format:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |

- Use **bold** for emphasis on key terms
- Use code blocks for formulas or specific data

CRITICAL RULES:
- NEVER make up or hallucinate information - only use what's in the documents
- ALWAYS be specific about which document/page information comes from
- If you cannot answer accurately with the given data, say so clearly
- When multiple documents are uploaded, clarify which document you're referencing`;

    // Prepare messages with file context if available
    const messagesWithContext = fileContext
      ? [
          { role: "system", content: systemPrompt },
          { role: "system", content: `Document Content:\n${fileContext}` },
          ...messages,
        ]
      : [
          { role: "system", content: systemPrompt },
          ...messages,
        ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: messagesWithContext,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in analyze-data:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ error: "Failed to analyze data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

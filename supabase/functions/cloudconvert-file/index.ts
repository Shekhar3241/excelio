import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, targetFormat } = await req.json();
    
    if (!fileBase64 || !fileName || !targetFormat) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: fileBase64, fileName, or targetFormat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const CLOUDCONVERT_API_KEY = Deno.env.get('CLOUDCONVERT_API_KEY');
    if (!CLOUDCONVERT_API_KEY) {
      throw new Error('CLOUDCONVERT_API_KEY not configured');
    }

    console.log(`Starting conversion: ${fileName} -> ${targetFormat}`);

    // Determine input and output formats
    const inputFormat = fileName.split('.').pop()?.toLowerCase() || 'pdf';
    const outputFormat = getOutputFormat(targetFormat);
    
    // Step 1: Create a conversion job
    const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: {
          'import-file': {
            operation: 'import/base64',
            file: fileBase64,
            filename: fileName,
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            output_format: outputFormat,
            input_format: inputFormat,
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file',
          },
        },
      }),
    });

    if (!jobResponse.ok) {
      const errorText = await jobResponse.text();
      console.error('CloudConvert job creation failed:', errorText);
      return new Response(
        JSON.stringify({ error: `CloudConvert API error: ${errorText}` }),
        { status: jobResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jobData = await jobResponse.json();
    console.log('Job created:', jobData.data.id);

    // Step 2: Wait for job completion
    const jobId = jobData.data.id;
    let jobStatus = 'processing';
    let attempts = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max

    while (jobStatus === 'processing' || jobStatus === 'waiting') {
      if (attempts >= maxAttempts) {
        throw new Error('Conversion timeout - job took too long');
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      attempts++;

      const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
        },
      });

      const statusData = await statusResponse.json();
      jobStatus = statusData.data.status;
      console.log(`Job status (attempt ${attempts}):`, jobStatus);

      if (jobStatus === 'error' || jobStatus === 'failed') {
        const errorTasks = Object.values(statusData.data.tasks).filter(
          (task: any) => task.status === 'error'
        );
        const errorDetails = errorTasks.map((task: any) => 
          `${task.name}: ${task.message || task.code}`
        ).join('; ');
        console.error('Conversion failed:', errorDetails);
        throw new Error(`Conversion failed: ${errorDetails}`);
      }

      if (jobStatus === 'finished') {
        // Get export task by name to avoid circular reference issues
        const tasks = statusData.data.tasks;
        console.log('Available tasks:', Object.keys(tasks));
        
        const exportTask = tasks['export-file'];
        console.log('Export task status:', exportTask?.status);
        console.log('Export task operation:', exportTask?.operation);

        if (!exportTask) {
          console.error('Export task not found in tasks');
          throw new Error('Export task not found');
        }

        // If export task isn't finished yet, continue polling
        if (exportTask.status !== 'finished') {
          console.log('Export task not ready, continuing to poll...');
          continue;
        }

        const downloadUrl = exportTask.result?.files?.[0]?.url;
        const outputFileName = exportTask.result?.files?.[0]?.filename;
        
        if (!downloadUrl || !outputFileName) {
          console.error('Export task result:', exportTask.result);
          throw new Error('No download URL found in export result');
        }

        console.log('Download URL retrieved:', outputFileName);

        // Download the converted file
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
          throw new Error('Failed to download converted file');
        }

        const arrayBuffer = await fileResponse.arrayBuffer();
        // Use Deno's built-in base64 encoding to handle large files efficiently
        const base64Content = base64Encode(arrayBuffer);

        console.log('Conversion completed successfully');

        return new Response(
          JSON.stringify({
            content: base64Content,
            fileName: outputFileName,
            mimeType: getMimeType(outputFormat),
            isBase64: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    throw new Error('Unexpected job status');

  } catch (error) {
    console.error('Error in cloudconvert-file function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getOutputFormat(targetFormat: string): string {
  const formatMap: Record<string, string> = {
    'word': 'docx',
    'excel': 'xlsx',
    'powerpoint': 'pptx',
    'jpg': 'jpg',
    'pdf': 'pdf',
    'text': 'txt',
    'html': 'html',
    'markdown': 'md',
    'compressed-pdf': 'pdf',
    'merged-pdf': 'pdf',
    'split-pdf': 'pdf',
    'rotated-pdf': 'pdf',
    'watermarked-pdf': 'pdf',
    'edited-pdf': 'pdf',
    'signed-pdf': 'pdf',
    'protected-pdf': 'pdf',
    'unlocked-pdf': 'pdf',
    'organized-pdf': 'pdf',
    'trimmed-pdf': 'pdf',
    'extracted-pdf': 'pdf',
  };

  return formatMap[targetFormat] || targetFormat;
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'txt': 'text/plain',
    'html': 'text/html',
    'md': 'text/markdown',
  };

  return mimeTypes[format] || 'application/octet-stream';
}

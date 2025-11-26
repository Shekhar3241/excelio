import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        // Find the export task and get the download URL
        const exportTask = Object.values(statusData.data.tasks).find(
          (task: any) => task.operation === 'export/url' && task.status === 'finished'
        ) as any;

        if (!exportTask) {
          console.error('No export task found in completed job');
          throw new Error('No export task found in completed job');
        }

        if (!exportTask.result || !exportTask.result.files || !Array.isArray(exportTask.result.files) || exportTask.result.files.length === 0) {
          console.error('No files found in export task result');
          throw new Error('No files found in export task result');
        }

        const fileInfo = exportTask.result.files[0];
        if (!fileInfo || !fileInfo.url) {
          console.error('No download URL found in file info');
          throw new Error('No download URL found in file info');
        }

        const downloadUrl = fileInfo.url;
        const outputFileName = fileInfo.filename;

        // Download the converted file
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
          throw new Error('Failed to download converted file');
        }

        const arrayBuffer = await fileResponse.arrayBuffer();
        const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

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

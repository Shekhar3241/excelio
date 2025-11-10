import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple Excel file generator (basic XLSX structure)
function generateSimpleExcel(title: string, data: string[][]): Uint8Array {
  // This is a simplified XLSX generator
  // In production, use a proper library or service
  const content = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      ${data.map(row => `
        <Row>
          ${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}
        </Row>
      `).join('')}
    </Table>
  </Worksheet>
</Workbook>`;
  
  return new TextEncoder().encode(content);
}

// Simple PDF generator (basic PDF structure)
function generateSimplePdf(title: string, content: string): Uint8Array {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 100 >>
stream
BT
/F1 24 Tf
50 700 Td
(${title}) Tj
/F1 12 Tf
50 650 Td
(${content}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
467
%%EOF`;
  
  return new TextEncoder().encode(pdfContent);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Generating sample files...');

    // Generate sample files for each resource
    const resources = [
      { 
        path: 'templates/personal-budget.xlsx', 
        type: 'excel',
        title: 'Personal Budget Tracker',
        data: [
          ['Category', 'Budget', 'Actual', 'Difference'],
          ['Income', '5000', '4800', '-200'],
          ['Rent', '1500', '1500', '0'],
          ['Food', '500', '450', '-50'],
          ['Transportation', '300', '280', '-20'],
        ]
      },
      { 
        path: 'templates/business-budget.xlsx', 
        type: 'excel',
        title: 'Business Budget Template',
        data: [
          ['Item', 'Q1', 'Q2', 'Q3', 'Q4'],
          ['Revenue', '50000', '55000', '60000', '65000'],
          ['Expenses', '35000', '37000', '40000', '42000'],
          ['Profit', '15000', '18000', '20000', '23000'],
        ]
      },
      { 
        path: 'cheat-sheets/formula-cheatsheet.pdf', 
        type: 'pdf',
        title: 'Excel Formulas Quick Reference',
        content: 'This guide covers essential Excel formulas including SUM, AVERAGE, VLOOKUP, IF, and more.'
      },
      { 
        path: 'cheat-sheets/keyboard-shortcuts.pdf', 
        type: 'pdf',
        title: 'Excel Keyboard Shortcuts',
        content: 'Master Excel with these essential keyboard shortcuts for Windows and Mac.'
      },
    ];

    let uploadedCount = 0;

    for (const resource of resources) {
      let fileData: Uint8Array;
      let contentType: string;

      if (resource.type === 'excel') {
        fileData = generateSimpleExcel(resource.title, resource.data || []);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        fileData = generateSimplePdf(resource.title, resource.content || '');
        contentType = 'application/pdf';
      }

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('resources')
        .upload(resource.path, fileData, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${resource.path}:`, error);
      } else {
        console.log(`Uploaded: ${resource.path}`);
        uploadedCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully generated and uploaded ${uploadedCount} sample files`,
        uploadedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

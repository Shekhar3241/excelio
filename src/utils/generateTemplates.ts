import * as XLSX from 'xlsx';

export function generatePersonalBudget(): Blob {
  const wb = XLSX.utils.book_new();
  
  // Budget sheet
  const budgetData = [
    ['Personal Budget Tracker - 2025', '', '', '', ''],
    ['', '', '', '', ''],
    ['Category', 'Budgeted', 'Actual', 'Difference', 'Notes'],
    ['INCOME', '', '', '', ''],
    ['Salary', 5000, 4800, -200, ''],
    ['Freelance', 500, 450, -50, ''],
    ['Other Income', 200, 150, -50, ''],
    ['Total Income', '=SUM(B5:B7)', '=SUM(C5:C7)', '=SUM(D5:D7)', ''],
    ['', '', '', '', ''],
    ['EXPENSES', '', '', '', ''],
    ['Housing', '', '', '', ''],
    ['Rent/Mortgage', 1500, 1500, 0, ''],
    ['Utilities', 200, 180, -20, ''],
    ['Internet', 60, 60, 0, ''],
    ['', '', '', '', ''],
    ['Transportation', '', '', '', ''],
    ['Gas', 200, 180, -20, ''],
    ['Car Insurance', 150, 150, 0, ''],
    ['', '', '', '', ''],
    ['Food & Dining', '', '', '', ''],
    ['Groceries', 400, 420, 20, ''],
    ['Restaurants', 200, 250, 50, ''],
    ['', '', '', '', ''],
    ['Entertainment', '', '', '', ''],
    ['Subscriptions', 50, 50, 0, ''],
    ['Hobbies', 100, 80, -20, ''],
    ['', '', '', '', ''],
    ['Savings', '', '', '', ''],
    ['Emergency Fund', 500, 500, 0, ''],
    ['Investments', 300, 300, 0, ''],
    ['', '', '', '', ''],
    ['Total Expenses', '=SUM(B12:B14,B17:B18,B21:B22,B25:B26,B29:B30)', '=SUM(C12:C14,C17:C18,C21:C22,C25:C26,C29:C30)', '=SUM(D12:D14,D17:D18,D21:D22,D25:D26,D29:D30)', ''],
    ['', '', '', '', ''],
    ['NET INCOME', '=B8-B32', '=C8-C32', '=D8-D32', ''],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(budgetData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Budget');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function generateBusinessBudget(): Blob {
  const wb = XLSX.utils.book_new();
  
  const budgetData = [
    ['Small Business Budget - 2025', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    ['REVENUE', '', '', '', '', ''],
    ['Product Sales', 35000, 38000, 42000, 45000, '=SUM(B5:E5)'],
    ['Service Revenue', 15000, 17000, 18000, 20000, '=SUM(B6:E6)'],
    ['Other Income', 2000, 2500, 3000, 3500, '=SUM(B7:E7)'],
    ['Total Revenue', '=SUM(B5:B7)', '=SUM(C5:C7)', '=SUM(D5:D7)', '=SUM(E5:E7)', '=SUM(B8:E8)'],
    ['', '', '', '', '', ''],
    ['EXPENSES', '', '', '', '', ''],
    ['Salaries & Wages', 20000, 20000, 21000, 21000, '=SUM(B11:E11)'],
    ['Rent', 3000, 3000, 3000, 3000, '=SUM(B12:E12)'],
    ['Utilities', 500, 550, 600, 650, '=SUM(B13:E13)'],
    ['Marketing', 2000, 2500, 3000, 3500, '=SUM(B14:E14)'],
    ['Supplies', 1500, 1600, 1700, 1800, '=SUM(B15:E15)'],
    ['Insurance', 800, 800, 800, 800, '=SUM(B16:E16)'],
    ['Technology', 1000, 1200, 1400, 1600, '=SUM(B17:E17)'],
    ['Professional Services', 1500, 1500, 2000, 2000, '=SUM(B18:E18)'],
    ['Miscellaneous', 700, 850, 900, 950, '=SUM(B19:E19)'],
    ['Total Expenses', '=SUM(B11:B19)', '=SUM(C11:C19)', '=SUM(D11:D19)', '=SUM(E11:E19)', '=SUM(B20:E20)'],
    ['', '', '', '', '', ''],
    ['NET PROFIT', '=B8-B20', '=C8-C20', '=D8-D20', '=E8-E20', '=SUM(B22:E22)'],
    ['Profit Margin %', '=B22/B8', '=C22/C8', '=D22/D8', '=E22/E8', '=F22/F8'],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(budgetData);
  
  ws['!cols'] = [
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Business Budget');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function generateProjectCalendar(): Blob {
  const wb = XLSX.utils.book_new();
  
  const calendarData = [
    ['Project Timeline Calendar', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['Task Name', 'Start Date', 'End Date', 'Duration (Days)', 'Status', 'Owner'],
    ['Project Planning', '2025-01-01', '2025-01-15', 14, 'Completed', 'Project Manager'],
    ['Requirements Gathering', '2025-01-16', '2025-01-31', 15, 'Completed', 'Business Analyst'],
    ['Design Phase', '2025-02-01', '2025-02-28', 27, 'In Progress', 'Designer'],
    ['Development Sprint 1', '2025-03-01', '2025-03-15', 14, 'Pending', 'Dev Team'],
    ['Development Sprint 2', '2025-03-16', '2025-03-31', 15, 'Pending', 'Dev Team'],
    ['Testing Phase', '2025-04-01', '2025-04-15', 14, 'Pending', 'QA Team'],
    ['UAT', '2025-04-16', '2025-04-30', 14, 'Pending', 'Client'],
    ['Deployment', '2025-05-01', '2025-05-05', 4, 'Pending', 'DevOps'],
    ['Post-Launch Support', '2025-05-06', '2025-05-31', 25, 'Pending', 'Support Team'],
    ['', '', '', '', '', ''],
    ['Milestones', '', '', '', '', ''],
    ['Kickoff Meeting', '2025-01-01', '', '', 'Completed', ''],
    ['Design Review', '2025-02-28', '', '', 'Scheduled', ''],
    ['Beta Launch', '2025-04-15', '', '', 'Pending', ''],
    ['Go Live', '2025-05-01', '', '', 'Pending', ''],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(calendarData);
  
  ws['!cols'] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Project Calendar');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function generateSalesTracker(): Blob {
  const wb = XLSX.utils.book_new();
  
  const salesData = [
    ['Sales Pipeline Tracker', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Lead Name', 'Company', 'Contact', 'Stage', 'Value', 'Probability', 'Expected Close'],
    ['John Smith', 'Acme Corp', 'john@acme.com', 'Negotiation', 15000, '70%', '2025-02-15'],
    ['Jane Doe', 'TechStart', 'jane@techstart.com', 'Proposal', 25000, '50%', '2025-03-01'],
    ['Bob Wilson', 'Global Inc', 'bob@global.com', 'Discovery', 8000, '30%', '2025-03-15'],
    ['Sarah Johnson', 'Innovate LLC', 'sarah@innovate.com', 'Qualified', 12000, '40%', '2025-02-28'],
    ['Mike Brown', 'Solutions Co', 'mike@solutions.com', 'Negotiation', 18000, '80%', '2025-02-10'],
    ['', '', '', '', '', '', ''],
    ['Summary Statistics', '', '', '', '', '', ''],
    ['Total Pipeline Value', '=SUM(E4:E8)', '', '', '', '', ''],
    ['Weighted Pipeline', '=SUMPRODUCT(E4:E8,F4:F8)', '', '', '', '', ''],
    ['Number of Opportunities', '=COUNTA(A4:A8)', '', '', '', '', ''],
    ['Average Deal Size', '=AVERAGE(E4:E8)', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Stage Breakdown', '', '', '', '', '', ''],
    ['Discovery', '=COUNTIF(D4:D8,"Discovery")', '', '', '', '', ''],
    ['Qualified', '=COUNTIF(D4:D8,"Qualified")', '', '', '', '', ''],
    ['Proposal', '=COUNTIF(D4:D8,"Proposal")', '', '', '', '', ''],
    ['Negotiation', '=COUNTIF(D4:D8,"Negotiation")', '', '', '', '', ''],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(salesData);
  
  ws['!cols'] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Pipeline');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function generateInventoryTracker(): Blob {
  const wb = XLSX.utils.book_new();
  
  const inventoryData = [
    ['Inventory Management System', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Item Name', 'SKU', 'Category', 'Quantity', 'Reorder Point', 'Unit Price', 'Total Value'],
    ['Laptop', 'LAP-001', 'Electronics', 25, 10, 800, '=D4*F4'],
    ['Mouse', 'MOU-001', 'Accessories', 150, 50, 15, '=D5*F5'],
    ['Keyboard', 'KEY-001', 'Accessories', 85, 30, 45, '=D6*F6'],
    ['Monitor', 'MON-001', 'Electronics', 40, 15, 300, '=D7*F7'],
    ['Desk Chair', 'CHR-001', 'Furniture', 20, 8, 250, '=D8*F8'],
    ['Desk', 'DSK-001', 'Furniture', 15, 5, 400, '=D9*F9'],
    ['Headphones', 'HDP-001', 'Accessories', 60, 25, 80, '=D10*F10'],
    ['Webcam', 'WEB-001', 'Electronics', 35, 15, 120, '=D11*F11'],
    ['', '', '', '', '', '', ''],
    ['Inventory Summary', '', '', '', '', '', ''],
    ['Total Items', '=COUNTA(A4:A11)', '', '', '', '', ''],
    ['Total Inventory Value', '=SUM(G4:G11)', '', '', '', '', ''],
    ['Low Stock Items', '=COUNTIF(D4:D11,"<"&E4:E11)', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Low Stock Alert', '', '', '', '', '', ''],
    ['Item Name', 'Current Stock', 'Reorder Point', 'Status', '', '', ''],
    ['=IF(D4<E4,A4,"")', '=IF(D4<E4,D4,"")', '=IF(D4<E4,E4,"")', '=IF(D4<E4,"REORDER NEEDED","")','', '', ''],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(inventoryData);
  
  ws['!cols'] = [
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function uploadTemplateToStorage(blob: Blob, path: string) {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { error } = await supabase.storage
    .from('resources')
    .upload(path, blob, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }
  
  return true;
}

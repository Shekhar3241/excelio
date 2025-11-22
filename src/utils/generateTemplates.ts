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

export function generatePremiumBudgetTracker(): Blob {
  const wb = XLSX.utils.book_new();
  
  // Dashboard Sheet - Enhanced with visual hierarchy
  const dashboardData = [
    ['═══════════════════════════════════════════════════════', '', '', '', '', ''],
    ['    PREMIUM BUDGET TRACKER 2025 - FINANCIAL DASHBOARD', '', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['╔═══ FINANCIAL SNAPSHOT ═══╗', '', '╔═══ BUDGET HEALTH ═══╗', '', '', ''],
    ['', '', '', '', '', ''],
    ['Total Monthly Income', '=Income!B15', '', 'Status', '=IF(B7-B8>=1000,"✓ Excellent",IF(B7-B8>0,"✓ Good","⚠ Deficit"))', ''],
    ['Total Monthly Expenses', '=Expenses!B50', '', 'Net Savings', '=B7-B8', ''],
    ['Savings Rate', '=TEXT(IF(B7>0,B9/B7,0),"0.0%")', '', 'Target Rate', '20%', ''],
    ['', '', '', '', '', ''],
    ['╔═══ KEY METRICS ═══╗', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['Largest Expense Category', '=INDEX(Expenses!A7:A48,MATCH(MAX(Expenses!C7:C48),Expenses!C7:C48,0))', '', 'Amount', '=MAX(Expenses!C7:C48)', ''],
    ['Average Daily Spending', '=TEXT(B8/30,"$#,##0.00")', '', 'vs Budget', '=TEXT((B8-Expenses!B50)/Expenses!B50,"0.0%")', ''],
    ['Days to Emergency Fund', '=IF(B9>0,TEXT((Goals!B7-Goals!C7)/B9,"#,##0")&" days","N/A")', '', 'Progress', '=TEXT(Goals!C7/Goals!B7,"0%")', ''],
    ['', '', '', '', '', ''],
    ['╔═══ TOP 5 EXPENSE CATEGORIES ═══╗', '', '', '', '', ''],
    ['Rank', 'Category', 'Amount', '% of Total', 'Budget vs Actual', ''],
    ['1', 'Housing', '=Expenses!C12', '=TEXT(C19/$B$8,"0.0%")', '=TEXT((C19-Expenses!B12)/Expenses!B12,"0.0%")', ''],
    ['2', 'Transportation', '=Expenses!C28', '=TEXT(C20/$B$8,"0.0%")', '=TEXT((C20-Expenses!B28)/Expenses!B28,"0.0%")', ''],
    ['3', 'Food & Dining', '=Expenses!C34', '=TEXT(C21/$B$8,"0.0%")', '=TEXT((C21-Expenses!B34)/Expenses!B34,"0.0%")', ''],
    ['4', 'Insurance', '=Expenses!C40', '=TEXT(C22/$B$8,"0.0%")', '=TEXT((C22-Expenses!B40)/Expenses!B40,"0.0%")', ''],
    ['5', 'Personal & Lifestyle', '=Expenses!C49', '=TEXT(C23/$B$8,"0.0%")', '=TEXT((C23-Expenses!B49)/Expenses!B49,"0.0%")', ''],
    ['', '', '', '', '', ''],
    ['╔═══ GOALS PROGRESS ═══╗', '', '', '', '', ''],
    ['Goal', 'Target', 'Current', 'Progress Bar', '% Complete', ''],
    ['Emergency Fund', '=Goals!B7', '=Goals!C7', '=REPT("█",INT(C27/B27*20))&REPT("░",20-INT(C27/B27*20))', '=TEXT(C27/B27,"0%")', ''],
    ['Vacation', '=Goals!B8', '=Goals!C8', '=REPT("█",INT(C28/B28*20))&REPT("░",20-INT(C28/B28*20))', '=TEXT(C28/B28,"0%")', ''],
    ['New Laptop', '=Goals!B9', '=Goals!C9', '=REPT("█",INT(C29/B29*20))&REPT("░",20-INT(C29/B29*20))', '=TEXT(C29/B29,"0%")', ''],
    ['', '', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', '', ''],
    ['💡 TIP: Review your dashboard weekly to stay on track!', '', '', '', '', ''],
  ];
  
  const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardData);
  dashboardSheet['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, dashboardSheet, 'Dashboard');
  
  // Income Sheet - Enhanced with multiple income streams
  const incomeData = [
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['    INCOME TRACKER - All Revenue Sources', '', '', '', ''],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Income Source', 'Budgeted', 'Actual', 'Difference', 'Notes'],
    ['', '', '', '', ''],
    ['╔═══ PRIMARY INCOME ═══╗', '', '', '', ''],
    ['Salary (Net - After Tax)', 5000, 5000, '=C8-B8', 'Main employment'],
    ['Performance Bonus', 500, 450, '=C9-B9', 'Quarterly bonus'],
    ['Commission', 300, 380, '=C10-B10', 'Sales commission'],
    ['Overtime Pay', 200, 150, '=C11-B11', ''],
    ['Primary Income Total', '=SUM(B8:B11)', '=SUM(C8:C11)', '=C12-B12', ''],
    ['', '', '', '', ''],
    ['╔═══ SECONDARY INCOME ═══╗', '', '', '', ''],
    ['Freelance/Consulting', 800, 950, '=C15-B15', 'Side projects'],
    ['Part-time Job', 400, 400, '=C16-B16', ''],
    ['Gig Economy (Uber, etc)', 200, 280, '=C17-B17', ''],
    ['Secondary Income Total', '=SUM(B15:B17)', '=SUM(C15:C17)', '=C18-B18', ''],
    ['', '', '', '', ''],
    ['╔═══ PASSIVE INCOME ═══╗', '', '', '', ''],
    ['Investment Dividends', 250, 245, '=C21-B21', 'Stock dividends'],
    ['Interest (Savings)', 30, 28, '=C22-B22', 'High-yield savings'],
    ['Rental Income', 1200, 1200, '=C23-B23', 'Property rental'],
    ['Royalties', 100, 95, '=C24-B24', 'Creative work'],
    ['Passive Income Total', '=SUM(B21:B24)', '=SUM(C21:C24)', '=C25-B25', ''],
    ['', '', '', '', ''],
    ['╔═══ OTHER INCOME ═══╗', '', '', '', ''],
    ['Tax Refund', 0, 0, '=C28-B28', ''],
    ['Gifts/Windfalls', 0, 200, '=C29-B29', ''],
    ['Reimbursements', 0, 0, '=C30-B30', ''],
    ['Other Total', '=SUM(B28:B30)', '=SUM(C28:C30)', '=C31-B31', ''],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['TOTAL MONTHLY INCOME', '=SUM(B12,B18,B25,B31)', '=SUM(C12,C18,C25,C31)', '=C34-B34', ''],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['╔═══ YEAR-TO-DATE ANALYSIS ═══╗', '', '', '', ''],
    ['Current Month', '=MONTH(TODAY())', '', '', ''],
    ['YTD Total Income', '=C34*B39', '', 'Actual total', '=C34*MONTH(TODAY())'],
    ['Average Monthly Income', '=C34', '', 'vs Budget', '=TEXT((C40-B40)/B40,"0.0%")'],
    ['Projected Annual Income', '=C34*12', '', '', '=B34*12'],
    ['Income Growth Rate', '=TEXT((C34-B34)/B34,"0.0%")', '', '', ''],
  ];
  
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  incomeSheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');
  
  // Expenses Sheet - Comprehensive categories
  const expensesData = [
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['    MONTHLY EXPENSES - Detailed Breakdown', '', '', '', ''],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Category', 'Budgeted', 'Actual', 'Difference', '% of Total'],
    ['', '', '', '', ''],
    ['╔═══ HOUSING ═══╗', '', '', '', ''],
    ['Rent/Mortgage Payment', 1800, 1800, '=C8-B8', '=TEXT(C8/$C$50,"0.0%")'],
    ['Property Tax', 250, 250, '=C9-B9', '=TEXT(C9/$C$50,"0.0%")'],
    ['HOA/Condo Fees', 120, 120, '=C10-B10', '=TEXT(C10/$C$50,"0.0%")'],
    ['Home Maintenance/Repairs', 200, 175, '=C11-B11', '=TEXT(C11/$C$50,"0.0%")'],
    ['Home Insurance', 120, 120, '=C12-B12', '=TEXT(C12/$C$50,"0.0%")'],
    ['Housing Subtotal ▼', '=SUM(B8:B12)', '=SUM(C8:C12)', '=C13-B13', '=TEXT(C13/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ UTILITIES ═══╗', '', '', '', ''],
    ['Electricity', 140, 132, '=C16-B16', '=TEXT(C16/$C$50,"0.0%")'],
    ['Water/Sewer', 65, 62, '=C17-B17', '=TEXT(C17/$C$50,"0.0%")'],
    ['Gas/Heating', 95, 88, '=C18-B18', '=TEXT(C18/$C$50,"0.0%")'],
    ['Trash/Recycling', 35, 35, '=C19-B19', '=TEXT(C19/$C$50,"0.0%")'],
    ['Internet/Cable', 85, 85, '=C20-B20', '=TEXT(C20/$C$50,"0.0%")'],
    ['Mobile Phone', 75, 75, '=C21-B21', '=TEXT(C21/$C$50,"0.0%")'],
    ['Utilities Subtotal ▼', '=SUM(B16:B21)', '=SUM(C16:C21)', '=C22-B22', '=TEXT(C22/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ TRANSPORTATION ═══╗', '', '', '', ''],
    ['Car Payment/Lease', 400, 400, '=C25-B25', '=TEXT(C25/$C$50,"0.0%")'],
    ['Gas/Fuel', 220, 198, '=C26-B26', '=TEXT(C26/$C$50,"0.0%")'],
    ['Car Insurance', 140, 140, '=C27-B27', '=TEXT(C27/$C$50,"0.0%")'],
    ['Car Maintenance/Repairs', 150, 125, '=C28-B28', '=TEXT(C28/$C$50,"0.0%")'],
    ['Parking/Tolls', 60, 55, '=C29-B29', '=TEXT(C29/$C$50,"0.0%")'],
    ['Public Transportation', 80, 70, '=C30-B30', '=TEXT(C30/$C$50,"0.0%")'],
    ['Ride Share/Taxi', 40, 45, '=C31-B31', '=TEXT(C31/$C$50,"0.0%")'],
    ['Transportation Subtotal ▼', '=SUM(B25:B31)', '=SUM(C25:C31)', '=C32-B32', '=TEXT(C32/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ FOOD & DINING ═══╗', '', '', '', ''],
    ['Groceries', 550, 580, '=C35-B35', '=TEXT(C35/$C$50,"0.0%")'],
    ['Restaurants/Dining Out', 280, 320, '=C36-B36', '=TEXT(C36/$C$50,"0.0%")'],
    ['Coffee Shops', 90, 105, '=C37-B37', '=TEXT(C37/$C$50,"0.0%")'],
    ['Food Delivery Services', 120, 145, '=C38-B38', '=TEXT(C38/$C$50,"0.0%")'],
    ['Work Lunches', 150, 165, '=C39-B39', '=TEXT(C39/$C$50,"0.0%")'],
    ['Food Subtotal ▼', '=SUM(B35:B39)', '=SUM(C35:C39)', '=C40-B40', '=TEXT(C40/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ INSURANCE ═══╗', '', '', '', ''],
    ['Health Insurance', 350, 350, '=C43-B43', '=TEXT(C43/$C$50,"0.0%")'],
    ['Dental Insurance', 40, 40, '=C44-B44', '=TEXT(C44/$C$50,"0.0%")'],
    ['Vision Insurance', 25, 25, '=C45-B45', '=TEXT(C45/$C$50,"0.0%")'],
    ['Life Insurance', 60, 60, '=C46-B46', '=TEXT(C46/$C$50,"0.0%")'],
    ['Disability Insurance', 45, 45, '=C47-B47', '=TEXT(C47/$C$50,"0.0%")'],
    ['Insurance Subtotal ▼', '=SUM(B43:B47)', '=SUM(C43:C47)', '=C48-B48', '=TEXT(C48/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ PERSONAL & LIFESTYLE ═══╗', '', '', '', ''],
    ['Clothing & Accessories', 120, 95, '=C51-B51', '=TEXT(C51/$C$50,"0.0%")'],
    ['Personal Care/Grooming', 90, 85, '=C52-B52', '=TEXT(C52/$C$50,"0.0%")'],
    ['Gym/Fitness Membership', 60, 60, '=C53-B53', '=TEXT(C53/$C$50,"0.0%")'],
    ['Entertainment/Events', 180, 165, '=C54-B54', '=TEXT(C54/$C$50,"0.0%")'],
    ['Streaming Services', 45, 45, '=C55-B55', '=TEXT(C55/$C$50,"0.0%")'],
    ['Gaming/Apps', 30, 35, '=C56-B56', '=TEXT(C56/$C$50,"0.0%")'],
    ['Hobbies/Recreation', 130, 148, '=C57-B57', '=TEXT(C57/$C$50,"0.0%")'],
    ['Books/Magazines', 40, 28, '=C58-B58', '=TEXT(C58/$C$50,"0.0%")'],
    ['Gifts/Donations', 100, 95, '=C59-B59', '=TEXT(C59/$C$50,"0.0%")'],
    ['Pet Care', 120, 135, '=C60-B60', '=TEXT(C60/$C$50,"0.0%")'],
    ['Personal Subtotal ▼', '=SUM(B51:B60)', '=SUM(C51:C60)', '=C61-B61', '=TEXT(C61/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ HEALTHCARE ═══╗', '', '', '', ''],
    ['Medical Co-pays', 80, 65, '=C64-B64', '=TEXT(C64/$C$50,"0.0%")'],
    ['Prescriptions', 60, 58, '=C65-B65', '=TEXT(C65/$C$50,"0.0%")'],
    ['Over-the-Counter Meds', 30, 22, '=C66-B66', '=TEXT(C66/$C$50,"0.0%")'],
    ['Healthcare Subtotal ▼', '=SUM(B64:B66)', '=SUM(C64:C66)', '=C67-B67', '=TEXT(C67/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ DEBT PAYMENTS ═══╗', '', '', '', ''],
    ['Credit Card Payments', 200, 200, '=C70-B70', '=TEXT(C70/$C$50,"0.0%")'],
    ['Student Loans', 250, 250, '=C71-B71', '=TEXT(C71/$C$50,"0.0%")'],
    ['Personal Loans', 150, 150, '=C72-B72', '=TEXT(C72/$C$50,"0.0%")'],
    ['Debt Subtotal ▼', '=SUM(B70:B72)', '=SUM(C70:C72)', '=C73-B73', '=TEXT(C73/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ SAVINGS & INVESTMENTS ═══╗', '', '', '', ''],
    ['Emergency Fund', 500, 500, '=C76-B76', '=TEXT(C76/$C$50,"0.0%")'],
    ['401k/Retirement', 600, 600, '=C77-B77', '=TEXT(C77/$C$50,"0.0%")'],
    ['Investment Accounts', 400, 400, '=C78-B78', '=TEXT(C78/$C$50,"0.0%")'],
    ['Savings Goals', 300, 300, '=C79-B79', '=TEXT(C79/$C$50,"0.0%")'],
    ['Savings Subtotal ▼', '=SUM(B76:B79)', '=SUM(C76:C79)', '=C80-B80', '=TEXT(C80/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['╔═══ MISCELLANEOUS ═══╗', '', '', '', ''],
    ['Education/Courses', 100, 85, '=C83-B83', '=TEXT(C83/$C$50,"0.0%")'],
    ['Professional Dues', 50, 50, '=C84-B84', '=TEXT(C84/$C$50,"0.0%")'],
    ['Bank Fees', 15, 12, '=C85-B85', '=TEXT(C85/$C$50,"0.0%")'],
    ['Other Expenses', 80, 95, '=C86-B86', '=TEXT(C86/$C$50,"0.0%")'],
    ['Miscellaneous Subtotal ▼', '=SUM(B83:B86)', '=SUM(C83:C86)', '=C87-B87', '=TEXT(C87/$C$50,"0.0%")'],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['TOTAL MONTHLY EXPENSES', '=SUM(B13,B22,B32,B40,B48,B61,B67,B73,B80,B87)', '=SUM(C13,C22,C32,C40,C48,C61,C67,C73,C80,C87)', '=C90-B90', '100.0%'],
    ['═══════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Budget Variance Analysis', '=IF(C90<=B90,"✓ Under Budget","⚠ Over Budget")', '', 'Amount', '=ABS(C90-B90)'],
    ['Largest Overspend Category', '=INDEX(A8:A87,MATCH(MAX((C8:C87-B8:B87)*(C8:C87>B8:B87)),C8:C87-B8:B87,0))', '', '', ''],
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  expensesSheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, expensesSheet, 'Expenses');
  
  // Savings Goals Sheet - Enhanced with progress tracking
  const goalsData = [
    ['═══════════════════════════════════════════════════════', '', '', '', ''],
    ['    SAVINGS GOALS TRACKER - Your Financial Future', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Goal Name', 'Target Amount', 'Current Saved', 'Monthly Deposit', 'Months to Goal'],
    ['', '', '', '', ''],
    ['╔═══ SHORT-TERM GOALS (< 1 year) ═══╗', '', '', '', ''],
    ['Emergency Fund (3-6 months)', 15000, 4200, 600, '=IF(D8>0,CEILING((B8-C8)/D8,1),"∞")'],
    ['Vacation Fund', 3500, 950, 250, '=IF(D9>0,CEILING((B9-C9)/D9,1),"∞")'],
    ['New Laptop/Electronics', 1800, 720, 180, '=IF(D10>0,CEILING((B10-C10)/D10,1),"∞")'],
    ['Holiday Shopping', 2000, 500, 200, '=IF(D11>0,CEILING((B11-C11)/D11,1),"∞")'],
    ['Home Improvement', 5000, 1200, 300, '=IF(D12>0,CEILING((B12-C12)/D12,1),"∞")'],
    ['Short-term Total', '=SUM(B8:B12)', '=SUM(C8:C12)', '=SUM(D8:D12)', ''],
    ['Short-term Progress', '=TEXT(C13/B13,"0%")', '', '', ''],
    ['', '', '', '', ''],
    ['╔═══ MEDIUM-TERM GOALS (1-5 years) ═══╗', '', '', '', ''],
    ['Car Down Payment', 18000, 3500, 450, '=IF(D17>0,CEILING((B17-C17)/D17,1),"∞")'],
    ['Wedding Fund', 25000, 6000, 500, '=IF(D18>0,CEILING((B18-C18)/D18,1),"∞")'],
    ['Home Down Payment', 60000, 12000, 800, '=IF(D19>0,CEILING((B19-C19)/D19,1),"∞")'],
    ['Major Renovation', 30000, 5500, 400, '=IF(D20>0,CEILING((B20-C20)/D20,1),"∞")'],
    ['Business Startup Fund', 20000, 2000, 350, '=IF(D21>0,CEILING((B21-C21)/D21,1),"∞")'],
    ['Medium-term Total', '=SUM(B17:B21)', '=SUM(C17:C21)', '=SUM(D17:D21)', ''],
    ['Medium-term Progress', '=TEXT(C22/B22,"0%")', '', '', ''],
    ['', '', '', '', ''],
    ['╔═══ LONG-TERM GOALS (5+ years) ═══╗', '', '', '', ''],
    ['Retirement Fund', 800000, 85000, 1500, '=IF(D26>0,CEILING((B26-C26)/D26,1),"∞")'],
    ["Children's College Fund", 150000, 22000, 700, '=IF(D27>0,CEILING((B27-C27)/D27,1),"∞")'],
    ['Investment Portfolio', 250000, 45000, 900, '=IF(D28>0,CEILING((B28-C28)/D28,1),"∞")'],
    ['Vacation Property', 100000, 8000, 600, '=IF(D29>0,CEILING((B29-C29)/D29,1),"∞")'],
    ['Long-term Total', '=SUM(B26:B29)', '=SUM(C26:C29)', '=SUM(D26:D29)', ''],
    ['Long-term Progress', '=TEXT(C30/B30,"0%")', '', '', ''],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', ''],
    ['OVERALL TOTALS', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', ''],
    ['Total Goal Amount', '=SUM(B13,B22,B30)', '', 'Total Saved', '=SUM(C13,C22,C30)'],
    ['Monthly Savings Target', '=SUM(D13,D22,D30)', '', 'Overall Progress', '=TEXT(E37/E36,"0.0%")'],
    ['On Track Status', '=IF(E38>=Income!C34*0.2,"✓ Excellent","⚠ Needs Improvement")', '', '', ''],
    ['', '', '', '', ''],
    ['╔═══ GOAL MILESTONES ═══╗', '', '', '', ''],
    ['Next Goal to Complete', '=INDEX(A8:A29,MATCH(MIN(E8:E29),E8:E29,0))', '', 'Months Away', '=MIN(E8:E29)'],
    ['Fastest Growing Goal', '=INDEX(A8:A29,MATCH(MAX(C8:C29/B8:B29),C8:C29/B8:B29,0))', '', 'Progress %', '=TEXT(MAX(C8:C29/B8:B29),"0%")'],
    ['Total Saved This Year', '=E37', '', 'Projected Year End', '=E37+(E38*12)'],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════════════', '', '', '', ''],
    ['💡 TIP: Automate your savings with direct deposits!', '', '', '', ''],
  ];
  
  const goalsSheet = XLSX.utils.aoa_to_sheet(goalsData);
  goalsSheet['!cols'] = [{ wch: 32 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, goalsSheet, 'Goals');
  
  // Monthly Summary Sheet - Year overview
  const summaryData = [
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['    MONTHLY SUMMARY & YEAR ANALYSIS', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Month', 'Income', 'Expenses', 'Net Savings', 'Savings Rate'],
    ['', '', '', '', ''],
    ['January', 7850, 5950, '=B7-C7', '=TEXT(D7/B7,"0.0%")'],
    ['February', 7900, 6100, '=B8-C8', '=TEXT(D8/B8,"0.0%")'],
    ['March', 8200, 6050, '=B9-C9', '=TEXT(D9/B9,"0.0%")'],
    ['April', 7850, 5980, '=B10-C10', '=TEXT(D10/B10,"0.0%")'],
    ['May', 8100, 6200, '=B11-C11', '=TEXT(D11/B11,"0.0%")'],
    ['June', 7950, 6150, '=B12-C12', '=TEXT(D12/B12,"0.0%")'],
    ['July', 0, 0, '=B13-C13', '=IF(B13>0,TEXT(D13/B13,"0.0%"),"")'],
    ['August', 0, 0, '=B14-C14', '=IF(B14>0,TEXT(D14/B14,"0.0%"),"")'],
    ['September', 0, 0, '=B15-C15', '=IF(B15>0,TEXT(D15/B15,"0.0%"),"")'],
    ['October', 0, 0, '=B16-C16', '=IF(B16>0,TEXT(D16/B16,"0.0%"),"")'],
    ['November', 0, 0, '=B17-C17', '=IF(B17>0,TEXT(D17/B17,"0.0%"),"")'],
    ['December', 0, 0, '=B18-C18', '=IF(B18>0,TEXT(D18/B18,"0.0%"),"")'],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['YEAR-TO-DATE SUMMARY', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Total YTD Income', '=SUM(B7:B18)', '', 'Average Monthly', '=AVERAGE(B7:B18)'],
    ['Total YTD Expenses', '=SUM(C7:C18)', '', 'Average Monthly', '=AVERAGE(C7:C18)'],
    ['Total YTD Savings', '=SUM(D7:D18)', '', 'Average Savings Rate', '=TEXT(B26/B24,"0.0%")'],
    ['', '', '', '', ''],
    ['Best Savings Month', '=TEXT(DATE(2025,MATCH(MAX(D7:D18),D7:D18,0),1),"mmmm")', '', 'Amount', '=MAX(D7:D18)'],
    ['Highest Income Month', '=TEXT(DATE(2025,MATCH(MAX(B7:B18),B7:B18,0),1),"mmmm")', '', 'Amount', '=MAX(B7:B18)'],
    ['Lowest Expense Month', '=TEXT(DATE(2025,MATCH(MIN(C7:C18),C7:C18,0),1),"mmmm")', '', 'Amount', '=MIN(C7:C18)'],
    ['', '', '', '', ''],
    ['╔═══ YEAR-END PROJECTIONS ═══╗', '', '', '', ''],
    ['Projected Annual Income', '=B24/MONTH(TODAY())*12', '', 'Current Pace', '=B24'],
    ['Projected Annual Expenses', '=B25/MONTH(TODAY())*12', '', 'Current Pace', '=B25'],
    ['Projected Annual Savings', '=B26/MONTH(TODAY())*12', '', 'Current Pace', '=B26'],
    ['Projected Savings Rate', '=TEXT(B35/B34,"0.0%")', '', 'Target Rate', '20%'],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['TREND ANALYSIS', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['', '', '', '', ''],
    ['Income Trend', '=IF(B12>B7,"↗ Increasing",IF(B12<B7,"↘ Decreasing","→ Stable"))', '', 'Change %', '=TEXT((B12-B7)/B7,"0.0%")'],
    ['Expense Trend', '=IF(C12>C7,"↗ Increasing",IF(C12<C7,"↘ Decreasing","→ Stable"))', '', 'Change %', '=TEXT((C12-C7)/C7,"0.0%")'],
    ['Savings Trend', '=IF(D12>D7,"✓ Improving",IF(D12<D7,"⚠ Declining","→ Stable"))', '', 'Change %', '=TEXT((D12-D7)/D7,"0.0%")'],
    ['', '', '', '', ''],
    ['═══════════════════════════════════════════════════════════', '', '', '', ''],
    ['💡 TIP: Aim to save 20% of your income consistently!', '', '', '', ''],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Monthly Summary');
  
  // Instructions Sheet
  const instructionsData = [
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['    PREMIUM BUDGET TRACKER 2025 - USER GUIDE', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['Welcome to Your Premium Budget Tracker!', '', '', ''],
    ['', '', '', ''],
    ['This comprehensive tool will help you take control of your finances with:', '', '', ''],
    ['• 6 integrated sheets for complete financial tracking', '', '', ''],
    ['• 100+ automatic formulas and calculations', '', '', ''],
    ['• Real-time budget analysis and alerts', '', '', ''],
    ['• Goal tracking with progress indicators', '', '', ''],
    ['• Year-over-year comparisons', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['QUICK START GUIDE', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['1. DASHBOARD Sheet', '', '', ''],
    ['   Your financial overview at a glance. All data auto-updates from other sheets.', '', '', ''],
    ['   Key Metrics: Income, Expenses, Savings Rate, Budget Health', '', '', ''],
    ['   Review this sheet weekly to monitor your financial health.', '', '', ''],
    ['', '', '', ''],
    ['2. INCOME Sheet', '', '', ''],
    ['   Track all income sources (primary, secondary, passive).', '', '', ''],
    ['   • Update the "Actual" column with real income received', '', '', ''],
    ['   • Add notes for clarity', '', '', ''],
    ['   • Monitor YTD totals and projections', '', '', ''],
    ['', '', '', ''],
    ['3. EXPENSES Sheet', '', '', ''],
    ['   Detailed tracking across 10+ categories with 60+ line items.', '', '', ''],
    ['   • Set your budget in "Budgeted" column', '', '', ''],
    ['   • Enter actual spending in "Actual" column', '', '', ''],
    ['   • Automatic calculations show variances and percentages', '', '', ''],
    ['   • Categories: Housing, Utilities, Transportation, Food, Insurance,', '', '', ''],
    ['     Personal, Healthcare, Debt, Savings, Miscellaneous', '', '', ''],
    ['', '', '', ''],
    ['4. GOALS Sheet', '', '', ''],
    ['   Set and track short, medium, and long-term financial goals.', '', '', ''],
    ['   • Enter target amounts and monthly contributions', '', '', ''],
    ['   • Automatic calculation of months-to-goal', '', '', ''],
    ['   • Progress tracking and milestone alerts', '', '', ''],
    ['   • Categories: Short-term (<1 year), Medium-term (1-5 years),', '', '', ''],
    ['     Long-term (5+ years)', '', '', ''],
    ['', '', '', ''],
    ['5. MONTHLY SUMMARY Sheet', '', '', ''],
    ['   Year-at-a-glance view with trend analysis.', '', '', ''],
    ['   • Enter monthly totals for income and expenses', '', '', ''],
    ['   • Automatic year-end projections', '', '', ''],
    ['   • Trend indicators and comparisons', '', '', ''],
    ['', '', '', ''],
    ['6. INSTRUCTIONS Sheet (You are here!)', '', '', ''],
    ['   Comprehensive guide and tips for using this tracker.', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['BEST PRACTICES FOR SUCCESS', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['✓ Update Your Data Weekly', '', '', ''],
    ['  Consistency is key! Set aside 15-30 minutes each week to update your actual spending.', '', '', ''],
    ['', '', '', ''],
    ['✓ Follow the 50/30/20 Rule', '', '', ''],
    ['  • 50% for Needs (housing, food, utilities)', '', '', ''],
    ['  • 30% for Wants (entertainment, dining out)', '', '', ''],
    ['  • 20% for Savings and debt repayment', '', '', ''],
    ['', '', '', ''],
    ['✓ Build an Emergency Fund First', '', '', ''],
    ['  Aim for 3-6 months of expenses saved in a liquid account.', '', '', ''],
    ['', '', '', ''],
    ['✓ Review Your Dashboard Weekly', '', '', ''],
    ['  Check your budget health status and top expense categories regularly.', '', '', ''],
    ['', '', '', ''],
    ['✓ Set Realistic Goals', '', '', ''],
    ['  Start small and increase savings as you optimize spending.', '', '', ''],
    ['', '', '', ''],
    ['✓ Track Every Dollar', '', '', ''],
    ['  Small expenses add up! Don\'t overlook coffee, subscriptions, and impulse purchases.', '', '', ''],
    ['', '', '', ''],
    ['✓ Automate Your Savings', '', '', ''],
    ['  Set up automatic transfers to savings and investment accounts.', '', '', ''],
    ['', '', '', ''],
    ['✓ Review and Adjust Monthly', '', '', ''],
    ['  Your budget should evolve with your life. Adjust categories as needed.', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['UNDERSTANDING THE FORMULAS', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['This tracker uses 100+ built-in formulas to automate calculations:', '', '', ''],
    ['', '', '', ''],
    ['• SUM functions calculate totals automatically', '', '', ''],
    ['• IF statements provide conditional alerts and status indicators', '', '', ''],
    ['• AVERAGE functions show your typical spending patterns', '', '', ''],
    ['• Percentage calculations show spending breakdowns', '', '', ''],
    ['• Text formatting displays currency and percentages clearly', '', '', ''],
    ['• Date functions calculate months-to-goal and projections', '', '', ''],
    ['', '', '', ''],
    ['⚠️ IMPORTANT: Do not delete formula cells! Only update cells marked for input.', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['CUSTOMIZATION TIPS', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['Feel free to customize this tracker to fit your needs:', '', '', ''],
    ['', '', '', ''],
    ['• Add/remove expense categories that match your lifestyle', '', '', ''],
    ['• Adjust budget amounts as your income changes', '', '', ''],
    ['• Add new goals or remove completed ones', '', '', ''],
    ['• Use the Notes column to track important details', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['TROUBLESHOOTING', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['Q: Numbers show as #REF! or #DIV/0!', '', '', ''],
    ['A: This means a formula reference was broken. Don\'t delete rows or columns', '', '', ''],
    ['   with formulas. Contact support if you need help restoring.', '', '', ''],
    ['', '', '', ''],
    ['Q: Percentages don\'t add up to 100%', '', '', ''],
    ['A: Make sure all expense categories are filled in with values (use 0 if needed).', '', '', ''],
    ['', '', '', ''],
    ['Q: Dashboard not updating', '', '', ''],
    ['A: Ensure you\'re entering data in the correct sheets. The Dashboard pulls from', '', '', ''],
    ['   Income, Expenses, and Goals sheets automatically.', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['SUPPORT & RESOURCES', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['Thank you for using the Premium Budget Tracker 2025!', '', '', ''],
    ['', '', '', ''],
    ['For questions, tips, and updates, visit our website.', '', '', ''],
    ['', '', '', ''],
    ['📧 Email: support@budgettracker.com', '', '', ''],
    ['🌐 Web: www.budgettracker.com', '', '', ''],
    ['', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['💡 Remember: A budget is a plan for your money, not a restriction.', '', '', ''],
    ['   It empowers you to spend on what matters most!', '', '', ''],
    ['═══════════════════════════════════════════════════════════════════', '', '', ''],
    ['', '', '', ''],
    ['Version 2.0 | © 2025 | Premium Budget Tracker | All Rights Reserved', '', '', ''],
  ];
  
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 80 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Instructions');
  
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

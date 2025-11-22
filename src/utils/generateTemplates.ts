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
  
  // Dashboard Sheet
  const dashboardData = [
    ['PREMIUM BUDGET TRACKER 2025', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['Financial Overview', '', '', '', '', ''],
    ['Total Monthly Income', '=Income!B15', '', 'Budget Health', '=IF(Dashboard!B4-Dashboard!B5>0,"SURPLUS","DEFICIT")', ''],
    ['Total Monthly Expenses', '=Expenses!B50', '', 'Monthly Savings', '=Dashboard!B4-Dashboard!B5', ''],
    ['Savings Rate', '=Dashboard!B6/Dashboard!B4', '', 'Goal Progress', '=Goals!B20/Goals!B19', ''],
    ['', '', '', '', '', ''],
    ['Quick Stats', '', '', '', '', ''],
    ['Largest Expense', '=MAX(Expenses!C12:C45)', '', 'Category', '=INDEX(Expenses!A12:A45,MATCH(MAX(Expenses!C12:C45),Expenses!C12:C45,0))', ''],
    ['Average Daily Spending', '=Dashboard!B5/30', '', '', '', ''],
    ['Days to Emergency Fund Goal', '=IF(Dashboard!B6>0,(Goals!B19-Goals!B20)/Dashboard!B6,0)', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['This Month vs Last Month', '', '', '', '', ''],
    ['Income Change', '0%', '', 'Change in $', '$0', ''],
    ['Expense Change', '0%', '', 'Change in $', '$0', ''],
    ['', '', '', '', '', ''],
    ['Budget Categories (Top 5)', '', 'Amount', '% of Total', '', ''],
    ['Housing', '', '=Expenses!C12', '=Dashboard!C18/Dashboard!B5', '', ''],
    ['Transportation', '', '=Expenses!C21', '=Dashboard!C19/Dashboard!B5', '', ''],
    ['Food', '', '=Expenses!C26', '=Dashboard!C20/Dashboard!B5', '', ''],
    ['Utilities', '', '=Expenses!C15', '=Dashboard!C21/Dashboard!B5', '', ''],
    ['Insurance', '', '=Expenses!C31', '=Dashboard!C22/Dashboard!B5', '', ''],
  ];
  
  const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardData);
  dashboardSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, dashboardSheet, 'Dashboard');
  
  // Income Sheet
  const incomeData = [
    ['INCOME TRACKER', '', '', '', ''],
    ['Track all your income sources', '', '', '', ''],
    ['', '', '', '', ''],
    ['Income Source', 'Budgeted', 'Actual', 'Difference', 'Notes'],
    ['', '', '', '', ''],
    ['PRIMARY INCOME', '', '', '', ''],
    ['Salary (Net)', 4500, 4500, '=C7-B7', 'Main job'],
    ['Bonuses', 500, 0, '=C8-B8', ''],
    ['', '', '', '', ''],
    ['SECONDARY INCOME', '', '', '', ''],
    ['Freelance/Side Hustle', 800, 950, '=C11-B11', ''],
    ['Investments/Dividends', 200, 180, '=C12-B12', ''],
    ['Rental Income', 0, 0, '=C13-B13', ''],
    ['', '', '', '', ''],
    ['TOTAL INCOME', '=SUM(B7:B8,B11:B13)', '=SUM(C7:C8,C11:C13)', '=C15-B15', ''],
    ['', '', '', '', ''],
    ['Year-to-Date', '', '', '', ''],
    ['Total Income (YTD)', '=C15*MONTH(TODAY())', '', '', ''],
    ['Average Monthly', '=C15', '', '', ''],
    ['Highest Month', '=C15', '', '', ''],
    ['Lowest Month', '=C15', '', '', ''],
  ];
  
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  incomeSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');
  
  // Expenses Sheet
  const expensesData = [
    ['MONTHLY EXPENSES', '', '', '', ''],
    ['Detailed expense tracking by category', '', '', '', ''],
    ['', '', '', '', ''],
    ['Category', 'Budgeted', 'Actual', 'Difference', '% of Budget'],
    ['', '', '', '', ''],
    ['HOUSING', '', '', '', ''],
    ['Rent/Mortgage', 1500, 1500, '=C7-B7', '=C7/$C$50'],
    ['Property Tax', 200, 200, '=C8-B8', '=C8/$C$50'],
    ['HOA Fees', 100, 100, '=C9-B9', '=C9/$C$50'],
    ['Home Maintenance', 150, 120, '=C10-B10', '=C10/$C$50'],
    ['Home Insurance', 100, 100, '=C11-B11', '=C11/$C$50'],
    ['Subtotal Housing', '=SUM(B7:B11)', '=SUM(C7:C11)', '=C12-B12', ''],
    ['', '', '', '', ''],
    ['UTILITIES', '', '', '', ''],
    ['Electricity', 120, 115, '=C15-B15', '=C15/$C$50'],
    ['Water/Sewer', 60, 58, '=C16-B16', '=C16/$C$50'],
    ['Gas/Heating', 80, 75, '=C17-B17', '=C17/$C$50'],
    ['Internet', 60, 60, '=C18-B18', '=C18/$C$50'],
    ['Phone', 70, 70, '=C19-B19', '=C19/$C$50'],
    ['Subtotal Utilities', '=SUM(B15:B19)', '=SUM(C15:C19)', '=C20-B20', ''],
    ['', '', '', '', ''],
    ['TRANSPORTATION', '', '', '', ''],
    ['Car Payment', 350, 350, '=C23-B23', '=C23/$C$50'],
    ['Gas/Fuel', 200, 180, '=C24-B24', '=C24/$C$50'],
    ['Car Insurance', 120, 120, '=C25-B25', '=C25/$C$50'],
    ['Maintenance/Repairs', 100, 85, '=C26-B26', '=C26/$C$50'],
    ['Public Transportation', 50, 40, '=C27-B27', '=C27/$C$50'],
    ['Subtotal Transportation', '=SUM(B23:B27)', '=SUM(C23:C27)', '=C28-B28', ''],
    ['', '', '', '', ''],
    ['FOOD & DINING', '', '', '', ''],
    ['Groceries', 500, 520, '=C31-B31', '=C31/$C$50'],
    ['Restaurants/Takeout', 250, 280, '=C32-B32', '=C32/$C$50'],
    ['Coffee Shops', 80, 90, '=C33-B33', '=C33/$C$50'],
    ['Subtotal Food', '=SUM(B31:B33)', '=SUM(C31:C33)', '=C34-B34', ''],
    ['', '', '', '', ''],
    ['INSURANCE', '', '', '', ''],
    ['Health Insurance', 300, 300, '=C37-B37', '=C37/$C$50'],
    ['Life Insurance', 50, 50, '=C38-B38', '=C38/$C$50'],
    ['Disability Insurance', 40, 40, '=C39-B39', '=C39/$C$50'],
    ['Subtotal Insurance', '=SUM(B37:B39)', '=SUM(C37:C39)', '=C40-B40', ''],
    ['', '', '', '', ''],
    ['PERSONAL & LIFESTYLE', '', '', '', ''],
    ['Clothing', 100, 85, '=C43-B43', '=C43/$C$50'],
    ['Personal Care', 80, 75, '=C44-B44', '=C44/$C$50'],
    ['Gym Membership', 50, 50, '=C45-B45', '=C45/$C$50'],
    ['Entertainment', 150, 140, '=C46-B46', '=C46/$C$50'],
    ['Subscriptions (Netflix, etc)', 60, 60, '=C47-B47', '=C47/$C$50'],
    ['Hobbies', 100, 120, '=C48-B48', '=C48/$C$50'],
    ['Subtotal Personal', '=SUM(B43:B48)', '=SUM(C43:C48)', '=C49-B49', ''],
    ['', '', '', '', ''],
    ['TOTAL EXPENSES', '=SUM(B12,B20,B28,B34,B40,B49)', '=SUM(C12,C20,C28,C34,C40,C49)', '=C50-B50', ''],
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  expensesSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, expensesSheet, 'Expenses');
  
  // Savings Goals Sheet
  const goalsData = [
    ['SAVINGS GOALS TRACKER', '', '', '', ''],
    ['Track your financial goals and progress', '', '', '', ''],
    ['', '', '', '', ''],
    ['Goal Name', 'Target Amount', 'Current Saved', 'Monthly Contribution', 'Months to Goal'],
    ['', '', '', '', ''],
    ['SHORT-TERM GOALS (< 1 year)', '', '', '', ''],
    ['Emergency Fund', 10000, 3500, 500, '=IF(D7>0,(B7-C7)/D7,0)'],
    ['Vacation', 3000, 800, 200, '=IF(D8>0,(B8-C8)/D8,0)'],
    ['New Laptop', 1500, 600, 150, '=IF(D9>0,(B9-C9)/D9,0)'],
    ['', '', '', '', ''],
    ['MEDIUM-TERM GOALS (1-5 years)', '', '', '', ''],
    ['Car Down Payment', 15000, 2000, 400, '=IF(D12>0,(B12-C12)/D12,0)'],
    ['Home Renovation', 25000, 5000, 300, '=IF(D13>0,(B13-C13)/D13,0)'],
    ['', '', '', '', ''],
    ['LONG-TERM GOALS (5+ years)', '', '', '', ''],
    ['Retirement Fund', 500000, 50000, 1000, '=IF(D16>0,(B16-C16)/D16,0)'],
    ['College Fund', 100000, 15000, 500, '=IF(D17>0,(B17-C17)/D17,0)'],
    ['', '', '', '', ''],
    ['TOTALS', '', '', '', ''],
    ['Total Goal Amount', '=SUM(B7:B9,B12:B13,B16:B17)', '', '', ''],
    ['Total Saved', '=SUM(C7:C9,C12:C13,C16:C17)', '', '', ''],
    ['Monthly Savings', '=SUM(D7:D9,D12:D13,D16:D17)', '', '', ''],
    ['Overall Progress', '=C20/B19', '', '', ''],
    ['', '', '', '', ''],
    ['Auto-Calculations', '', '', '', ''],
    ['Next Milestone', '=MIN(B7:B17)', '', '', ''],
    ['Projected Completion', '=TEXT(TODAY()+30*E7,"mmm yyyy")', '', '', ''],
  ];
  
  const goalsSheet = XLSX.utils.aoa_to_sheet(goalsData);
  goalsSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, goalsSheet, 'Goals');
  
  // Monthly Summary Sheet
  const summaryData = [
    ['MONTHLY SUMMARY & REPORTS', '', '', '', ''],
    ['', '', '', '', ''],
    ['Month', 'Income', 'Expenses', 'Savings', 'Savings Rate'],
    ['January', 6000, 4500, 1500, '=D4/B4'],
    ['February', 6000, 4550, 1450, '=D5/B5'],
    ['March', 6150, 4600, 1550, '=D6/B6'],
    ['April', 6000, 4480, 1520, '=D7/B7'],
    ['May', 6200, 4520, 1680, '=D8/B8'],
    ['June', 6000, 4590, 1410, '=D9/B9'],
    ['July', 0, 0, 0, '=IF(B10>0,D10/B10,0)'],
    ['August', 0, 0, 0, '=IF(B11>0,D11/B11,0)'],
    ['September', 0, 0, 0, '=IF(B12>0,D12/B12,0)'],
    ['October', 0, 0, 0, '=IF(B13>0,D13/B13,0)'],
    ['November', 0, 0, 0, '=IF(B14>0,D14/B14,0)'],
    ['December', 0, 0, 0, '=IF(B15>0,D15/B15,0)'],
    ['', '', '', '', ''],
    ['YEAR TOTALS', '=SUM(B4:B15)', '=SUM(C4:C15)', '=SUM(D4:D15)', '=D17/B17'],
    ['', '', '', '', ''],
    ['ANALYSIS', '', '', '', ''],
    ['Best Savings Month', '=MAX(D4:D15)', '', '', ''],
    ['Worst Savings Month', '=MIN(D4:D15)', '', '', ''],
    ['Average Monthly Savings', '=AVERAGE(D4:D15)', '', '', ''],
    ['Total Saved YTD', '=SUM(D4:D15)', '', '', ''],
    ['', '', '', '', ''],
    ['PROJECTIONS', '', '', '', ''],
    ['Projected Year-End Savings', '=D22*12', '', '', ''],
    ['Projected Annual Income', '=AVERAGE(B4:B15)*12', '', '', ''],
    ['Projected Annual Expenses', '=AVERAGE(C4:C15)*12', '', '', ''],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
  
  // Instructions Sheet
  const instructionsData = [
    ['PREMIUM BUDGET TRACKER - USER GUIDE', '', ''],
    ['', '', ''],
    ['Welcome to your Premium Budget Tracker!', '', ''],
    ['', '', ''],
    ['HOW TO USE THIS TEMPLATE:', '', ''],
    ['', '', ''],
    ['1. DASHBOARD', '', ''],
    ['   - View your overall financial health at a glance', '', ''],
    ['   - See key metrics like savings rate and budget health', '', ''],
    ['   - Monitor your top expense categories', '', ''],
    ['', '', ''],
    ['2. INCOME', '', ''],
    ['   - Enter your budgeted income for each source', '', ''],
    ['   - Update actual amounts as you receive income', '', ''],
    ['   - Track year-to-date totals automatically', '', ''],
    ['', '', ''],
    ['3. EXPENSES', '', ''],
    ['   - Set budget amounts for each category', '', ''],
    ['   - Enter actual spending as it occurs', '', ''],
    ['   - See automatic calculations for differences and percentages', '', ''],
    ['', '', ''],
    ['4. GOALS', '', ''],
    ['   - Define your short, medium, and long-term savings goals', '', ''],
    ['   - Set target amounts and monthly contributions', '', ''],
    ['   - Track progress automatically with months-to-goal calculations', '', ''],
    ['', '', ''],
    ['5. SUMMARY', '', ''],
    ['   - Review monthly trends throughout the year', '', ''],
    ['   - Analyze savings patterns and identify improvements', '', ''],
    ['   - View projections for year-end finances', '', ''],
    ['', '', ''],
    ['TIPS FOR SUCCESS:', '', ''],
    ['', '', ''],
    ['✓ Update your actual expenses weekly for accuracy', '', ''],
    ['✓ Review your Dashboard monthly to track progress', '', ''],
    ['✓ Adjust budget amounts based on spending patterns', '', ''],
    ['✓ Set realistic savings goals and celebrate milestones', '', ''],
    ['✓ Use the Summary sheet to identify spending trends', '', ''],
    ['', '', ''],
    ['PREMIUM FEATURES:', '', ''],
    ['', '', ''],
    ['• Advanced formulas for automatic calculations', '', ''],
    ['• Multiple tracking sheets for comprehensive budgeting', '', ''],
    ['• Goal tracking with progress indicators', '', ''],
    ['• Year-to-date summaries and projections', '', ''],
    ['• Percentage-based expense analysis', '', ''],
    ['• Professional formatting and organization', '', ''],
    ['', '', ''],
    ['For questions or support, visit our website', '', ''],
  ];
  
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 50 }, { wch: 20 }, { wch: 20 }];
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

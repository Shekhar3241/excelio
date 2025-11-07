export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'template' | 'cheat-sheet' | 'workbook' | 'industry';
  industry?: string;
  fileType: 'xlsx' | 'pdf' | 'xlsm';
  downloadUrl: string;
  thumbnail?: string;
  downloads: number;
  tags: string[];
}

export const resources: Resource[] = [
  // Budget Templates
  {
    id: 'personal-budget',
    title: 'Personal Budget Tracker',
    description: 'Complete monthly budget template with automatic calculations, expense categories, and visual charts.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 15420,
    tags: ['budget', 'personal', 'finance', 'tracking']
  },
  {
    id: 'business-budget',
    title: 'Small Business Budget',
    description: 'Professional business budget template with revenue projections, expense tracking, and cash flow analysis.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 8932,
    tags: ['business', 'budget', 'finance', 'cash-flow']
  },
  
  // Calendar Templates
  {
    id: 'project-calendar',
    title: 'Project Timeline Calendar',
    description: 'Dynamic project calendar with Gantt chart visualization, milestone tracking, and automatic date calculations.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 12567,
    tags: ['calendar', 'project', 'timeline', 'planning']
  },
  {
    id: 'content-calendar',
    title: 'Content Calendar 2025',
    description: 'Social media and content planning calendar with posting schedules and engagement tracking.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 9834,
    tags: ['calendar', 'content', 'marketing', 'social-media']
  },

  // Tracker Templates
  {
    id: 'sales-tracker',
    title: 'Sales Pipeline Tracker',
    description: 'Track sales opportunities, conversion rates, and revenue with automated KPI dashboards.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 11245,
    tags: ['sales', 'crm', 'tracking', 'revenue']
  },
  {
    id: 'inventory-tracker',
    title: 'Inventory Management System',
    description: 'Complete inventory tracking with low stock alerts, reorder points, and supplier management.',
    category: 'template',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 7621,
    tags: ['inventory', 'stock', 'warehouse', 'management']
  },

  // Cheat Sheets
  {
    id: 'formula-cheatsheet',
    title: 'Excel Formulas Quick Reference',
    description: 'Comprehensive PDF guide covering 150+ essential Excel formulas with examples and use cases.',
    category: 'cheat-sheet',
    fileType: 'pdf',
    downloadUrl: '#',
    downloads: 23456,
    tags: ['formulas', 'reference', 'guide', 'learning']
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Excel Keyboard Shortcuts',
    description: 'Complete list of Excel keyboard shortcuts for Windows and Mac to boost your productivity.',
    category: 'cheat-sheet',
    fileType: 'pdf',
    downloadUrl: '#',
    downloads: 18932,
    tags: ['shortcuts', 'productivity', 'tips', 'efficiency']
  },
  {
    id: 'data-analysis-guide',
    title: 'Data Analysis Guide',
    description: 'Step-by-step guide to data analysis in Excel including pivot tables, charts, and statistical functions.',
    category: 'cheat-sheet',
    fileType: 'pdf',
    downloadUrl: '#',
    downloads: 14567,
    tags: ['data-analysis', 'pivot-tables', 'statistics', 'guide']
  },

  // Practice Workbooks
  {
    id: 'beginner-exercises',
    title: 'Beginner Formula Exercises',
    description: '50 practice exercises covering basic formulas with solutions and explanations.',
    category: 'workbook',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 16789,
    tags: ['practice', 'beginner', 'exercises', 'learning']
  },
  {
    id: 'advanced-exercises',
    title: 'Advanced Formula Challenges',
    description: '30 complex scenarios to master advanced formulas, array functions, and dynamic calculations.',
    category: 'workbook',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 9234,
    tags: ['practice', 'advanced', 'challenges', 'formulas']
  },
  {
    id: 'dashboard-practice',
    title: 'Dashboard Building Practice',
    description: 'Learn to build professional dashboards with sample data and step-by-step instructions.',
    category: 'workbook',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 11456,
    tags: ['dashboard', 'visualization', 'practice', 'charts']
  },

  // Industry-Specific Templates
  {
    id: 'accounting-ledger',
    title: 'General Ledger Template',
    description: 'Professional accounting ledger with automated trial balance, journal entries, and financial statements.',
    category: 'industry',
    industry: 'Accounting',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 6789,
    tags: ['accounting', 'ledger', 'finance', 'bookkeeping']
  },
  {
    id: 'hr-timesheet',
    title: 'Employee Timesheet & Payroll',
    description: 'Complete HR timesheet template with overtime calculations, leave tracking, and payroll processing.',
    category: 'industry',
    industry: 'HR',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 8456,
    tags: ['hr', 'payroll', 'timesheet', 'employee']
  },
  {
    id: 'sales-commission',
    title: 'Sales Commission Calculator',
    description: 'Automated commission tracking with tiered rates, bonuses, and performance analytics.',
    category: 'industry',
    industry: 'Sales',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 7234,
    tags: ['sales', 'commission', 'compensation', 'tracking']
  },
  {
    id: 'financial-dashboard',
    title: 'Financial KPI Dashboard',
    description: 'Executive financial dashboard with key metrics, ratios, and trend analysis for CFOs.',
    category: 'industry',
    industry: 'Accounting',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 5432,
    tags: ['finance', 'dashboard', 'kpi', 'analytics']
  },
  {
    id: 'recruitment-tracker',
    title: 'Recruitment Pipeline Tracker',
    description: 'Track job openings, candidates, interviews, and hiring metrics with automated workflows.',
    category: 'industry',
    industry: 'HR',
    fileType: 'xlsx',
    downloadUrl: '#',
    downloads: 6123,
    tags: ['hr', 'recruitment', 'hiring', 'ats']
  }
];

export const categories = [
  { id: 'all', label: 'All Resources', count: resources.length },
  { id: 'template', label: 'Templates', count: resources.filter(r => r.category === 'template').length },
  { id: 'cheat-sheet', label: 'Cheat Sheets', count: resources.filter(r => r.category === 'cheat-sheet').length },
  { id: 'workbook', label: 'Practice Workbooks', count: resources.filter(r => r.category === 'workbook').length },
  { id: 'industry', label: 'Industry-Specific', count: resources.filter(r => r.category === 'industry').length }
];

export const industries = ['All', 'Accounting', 'Sales', 'HR', 'Marketing', 'Operations'];
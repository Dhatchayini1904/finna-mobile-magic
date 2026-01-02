// Mock bank and transaction data for AI insights
// This simulates data that would come from a bank integration like Plaid

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  institution: string;
  lastUpdated: string;
  accountNumber: string;
}

export interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  merchant: string;
  icon: string;
  paymentMethod: string;
}

export interface SpendingSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  topCategories: { name: string; amount: number; percentage: number }[];
  monthOverMonthChange: number;
}

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'acc_1',
    name: 'HDFC Savings',
    type: 'savings',
    balance: 284650.50,
    institution: 'HDFC Bank',
    lastUpdated: new Date().toISOString(),
    accountNumber: '****4523',
  },
  {
    id: 'acc_2',
    name: 'ICICI Current',
    type: 'checking',
    balance: 45230.00,
    institution: 'ICICI Bank',
    lastUpdated: new Date().toISOString(),
    accountNumber: '****8901',
  },
  {
    id: 'acc_3',
    name: 'SBI Credit Card',
    type: 'credit',
    balance: -15420.00,
    institution: 'SBI Cards',
    lastUpdated: new Date().toISOString(),
    accountNumber: '****3456',
  },
  {
    id: 'acc_4',
    name: 'Zerodha Demat',
    type: 'investment',
    balance: 124500.00,
    institution: 'Zerodha',
    lastUpdated: new Date().toISOString(),
    accountNumber: '****7890',
  },
];

export const mockTransactions: MockTransaction[] = [
  {
    id: 'txn_1',
    description: 'Salary Credit',
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: '2024-01-15',
    merchant: 'TechCorp India',
    icon: 'briefcase',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'txn_2',
    description: 'Grocery Shopping',
    amount: 3450,
    type: 'expense',
    category: 'Groceries',
    date: '2024-01-14',
    merchant: 'BigBasket',
    icon: 'shopping-cart',
    paymentMethod: 'UPI',
  },
  {
    id: 'txn_3',
    description: 'Electricity Bill',
    amount: 2850,
    type: 'expense',
    category: 'Utilities',
    date: '2024-01-13',
    merchant: 'BESCOM',
    icon: 'zap',
    paymentMethod: 'Auto-debit',
  },
  {
    id: 'txn_4',
    description: 'Netflix Subscription',
    amount: 649,
    type: 'expense',
    category: 'Entertainment',
    date: '2024-01-12',
    merchant: 'Netflix',
    icon: 'tv',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'txn_5',
    description: 'Freelance Payment',
    amount: 15000,
    type: 'income',
    category: 'Freelance',
    date: '2024-01-11',
    merchant: 'Client ABC',
    icon: 'laptop',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'txn_6',
    description: 'Swiggy Order',
    amount: 456,
    type: 'expense',
    category: 'Food & Dining',
    date: '2024-01-10',
    merchant: 'Swiggy',
    icon: 'utensils',
    paymentMethod: 'UPI',
  },
  {
    id: 'txn_7',
    description: 'Uber Ride',
    amount: 320,
    type: 'expense',
    category: 'Transportation',
    date: '2024-01-10',
    merchant: 'Uber',
    icon: 'car',
    paymentMethod: 'UPI',
  },
  {
    id: 'txn_8',
    description: 'Amazon Shopping',
    amount: 4599,
    type: 'expense',
    category: 'Shopping',
    date: '2024-01-09',
    merchant: 'Amazon India',
    icon: 'shopping-bag',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'txn_9',
    description: 'Gym Membership',
    amount: 2500,
    type: 'expense',
    category: 'Health',
    date: '2024-01-08',
    merchant: 'Cult.fit',
    icon: 'dumbbell',
    paymentMethod: 'UPI',
  },
  {
    id: 'txn_10',
    description: 'Mutual Fund SIP',
    amount: 10000,
    type: 'expense',
    category: 'Investments',
    date: '2024-01-05',
    merchant: 'Groww',
    icon: 'trending-up',
    paymentMethod: 'Auto-debit',
  },
  {
    id: 'txn_11',
    description: 'Mobile Recharge',
    amount: 599,
    type: 'expense',
    category: 'Utilities',
    date: '2024-01-04',
    merchant: 'Jio',
    icon: 'smartphone',
    paymentMethod: 'UPI',
  },
  {
    id: 'txn_12',
    description: 'Dividend Credit',
    amount: 2500,
    type: 'income',
    category: 'Investments',
    date: '2024-01-03',
    merchant: 'HDFC Bank',
    icon: 'banknote',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'txn_13',
    description: 'Restaurant Dinner',
    amount: 2800,
    type: 'expense',
    category: 'Food & Dining',
    date: '2024-01-02',
    merchant: 'The Grand Restaurant',
    icon: 'utensils',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'txn_14',
    description: 'Spotify Premium',
    amount: 119,
    type: 'expense',
    category: 'Entertainment',
    date: '2024-01-01',
    merchant: 'Spotify',
    icon: 'music',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'txn_15',
    description: 'Petrol',
    amount: 3000,
    type: 'expense',
    category: 'Transportation',
    date: '2024-01-01',
    merchant: 'HP Petrol Pump',
    icon: 'fuel',
    paymentMethod: 'Credit Card',
  },
];

export function getSpendingSummary(): SpendingSummary {
  const income = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate category breakdown
  const categoryTotals: Record<string, number> = {};
  mockTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const topCategories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / expenses) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: income - expenses,
    topCategories,
    monthOverMonthChange: 12.5, // Mock percentage change
  };
}

export function getFinancialContext(): string {
  const summary = getSpendingSummary();
  const accounts = mockBankAccounts;
  const recentTxns = mockTransactions.slice(0, 10);

  return `
User's Financial Summary:
- Total Balance Across Accounts: ₹${accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString('en-IN')}
- Monthly Income: ₹${summary.totalIncome.toLocaleString('en-IN')}
- Monthly Expenses: ₹${summary.totalExpenses.toLocaleString('en-IN')}
- Net Savings: ₹${summary.netBalance.toLocaleString('en-IN')}
- Month-over-Month Change: ${summary.monthOverMonthChange > 0 ? '+' : ''}${summary.monthOverMonthChange}%

Bank Accounts:
${accounts.map(a => `- ${a.name} (${a.type}): ₹${a.balance.toLocaleString('en-IN')}`).join('\n')}

Top Spending Categories:
${summary.topCategories.map(c => `- ${c.name}: ₹${c.amount.toLocaleString('en-IN')} (${c.percentage}%)`).join('\n')}

Recent Transactions:
${recentTxns.map(t => `- ${t.description}: ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')} (${t.category})`).join('\n')}
`.trim();
}

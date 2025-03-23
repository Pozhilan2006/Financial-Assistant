/**
 * Utility functions for making API calls to the backend
 */

// Generic API call function with error handling
export async function apiCall<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint} API:`, error);
    throw error;
  }
}

// Budget calculation
export async function calculateBudget(data: {
  monthlyIncome: number;
  customAllocation?: Record<string, number>;
}) {
  return apiCall('budget', data);
}

// Expense analysis
export async function analyzeExpenses(data: {
  expenses: Array<{
    category: string;
    amount: number;
    date: string;
    description?: string;
  }>;
  monthlyIncome?: number;
  budgetLimits?: Record<string, number>;
}) {
  return apiCall('expenses', data);
}

// Savings calculation
export async function calculateSavings(data: {
  currentSavings: number;
  monthlySavings: number;
  savingsGoal?: number;
  targetDate?: string;
  interestRate?: number;
}) {
  return apiCall('savings', data);
}

// Investment calculation
export async function calculateInvestment(data: {
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  riskProfile?: 'low' | 'medium' | 'high';
  allocation?: {
    stocks: number;
    bonds: number;
    cash: number;
    realEstate: number;
  };
  customReturns?: Record<string, number>;
}) {
  return apiCall('investments', data);
}

// Loan calculation
export async function calculateLoan(data: {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  loanType?: 'mortgage' | 'personal' | 'auto' | 'education';
  downPayment?: number;
  extraPayment?: number;
}) {
  return apiCall('loans', data);
}
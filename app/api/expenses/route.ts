import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface Expense {
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface ExpenseAnalysisRequest {
  expenses: Expense[];
  monthlyIncome?: number;
  budgetLimits?: Record<string, number>;
}

export interface ExpenseAnalysisResponse {
  success: boolean;
  data: {
    totalExpenses: number;
    categoryBreakdown: Record<string, number>;
    categoryPercentages: Record<string, number>;
    topCategories: Array<{ category: string; amount: number; percentage: number }>;
    budgetStatus?: Record<string, { limit: number; spent: number; remaining: number; percentUsed: number }>;
    savingsRate?: number;
    recommendations: string[];
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExpenseAnalysisRequest = await request.json();
    
    if (!body.expenses || !Array.isArray(body.expenses) || body.expenses.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid expenses array is required' },
        { status: 400 }
      );
    }

    const { expenses, monthlyIncome, budgetLimits } = body;
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + expense.amount;
    });
    
    // Calculate category percentages
    const categoryPercentages: Record<string, number> = {};
    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
      categoryPercentages[category] = parseFloat(((amount / totalExpenses) * 100).toFixed(1));
    });
    
    // Get top spending categories
    const topCategories = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: categoryPercentages[category]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Budget status if budget limits are provided
    let budgetStatus: Record<string, any> | undefined;
    if (budgetLimits) {
      budgetStatus = {};
      Object.entries(budgetLimits).forEach(([category, limit]) => {
        const spent = categoryBreakdown[category.toLowerCase()] || 0;
        const remaining = Math.max(0, limit - spent);
        const percentUsed = parseFloat(((spent / limit) * 100).toFixed(1));
        
        budgetStatus![category] = {
          limit,
          spent,
          remaining,
          percentUsed
        };
      });
    }
    
    // Calculate savings rate if income is provided
    let savingsRate: number | undefined;
    if (monthlyIncome && monthlyIncome > 0) {
      savingsRate = parseFloat(((1 - (totalExpenses / monthlyIncome)) * 100).toFixed(1));
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    // Recommendation based on top spending categories
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      if (topCategory.percentage > 30) {
        recommendations.push(
          `Your ${topCategory.category} expenses account for ${topCategory.percentage}% of your total spending. Consider reducing this by 10-15% to improve your financial balance.`
        );
      }
    }
    
    // Recommendation based on budget limits
    if (budgetStatus) {
      const overBudgetCategories = Object.entries(budgetStatus)
        .filter(([_, data]) => data.percentUsed > 100)
        .map(([category, data]) => ({
          category,
          percentUsed: data.percentUsed
        }));
      
      if (overBudgetCategories.length > 0) {
        const category = overBudgetCategories[0].category;
        const percent = overBudgetCategories[0].percentUsed;
        recommendations.push(
          `You've exceeded your ${category} budget by ${(percent - 100).toFixed(1)}%. Try to adjust your spending in this category for the rest of the month.`
        );
      }
    }
    
    // Recommendation based on savings rate
    if (savingsRate !== undefined) {
      if (savingsRate < 10) {
        recommendations.push(
          `Your current savings rate is ${savingsRate}%, which is below the recommended 15-20%. Consider increasing your savings to build a stronger financial foundation.`
        );
      } else if (savingsRate > 30) {
        recommendations.push(
          `Your savings rate of ${savingsRate}% is excellent! You might consider investing some of your savings for long-term growth.`
        );
      }
    }
    
    // Add a general recommendation if we don't have many specific ones
    if (recommendations.length < 2) {
      recommendations.push(
        "Track your expenses consistently to identify patterns and opportunities for saving."
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        totalExpenses,
        categoryBreakdown,
        categoryPercentages,
        topCategories,
        budgetStatus,
        savingsRate,
        recommendations
      }
    });
  } catch (error) {
    console.error('Expense analysis error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process expense analysis' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface BudgetRequest {
  monthlyIncome: number;
  customAllocation?: {
    housing?: number;
    savings?: number;
    food?: number;
    transportation?: number;
    entertainment?: number;
    utilities?: number;
    insurance?: number;
    miscellaneous?: number;
  };
}

export interface BudgetResponse {
  success: boolean;
  data: {
    housing: number;
    savings: number;
    food: number;
    transportation: number;
    entertainment: number;
    utilities: number;
    insurance: number;
    miscellaneous: number;
    totalAllocated: number;
    remaining: number;
  };
  message?: string;
}

// Default budget allocation percentages
const DEFAULT_ALLOCATIONS = {
  housing: 0.3,      // 30%
  savings: 0.2,      // 20%
  food: 0.15,        // 15%
  transportation: 0.1, // 10%
  entertainment: 0.1, // 10%
  utilities: 0.05,   // 5%
  insurance: 0.05,   // 5%
  miscellaneous: 0.05 // 5%
};

export async function POST(request: NextRequest) {
  try {
    const body: BudgetRequest = await request.json();
    
    if (!body.monthlyIncome || body.monthlyIncome <= 0) {
      return NextResponse.json(
        { success: false, message: 'Monthly income must be a positive number' },
        { status: 400 }
      );
    }

    const { monthlyIncome, customAllocation = {} } = body;
    
    // Calculate budget allocations
    const allocations = {
      housing: Math.round(monthlyIncome * (customAllocation.housing ?? DEFAULT_ALLOCATIONS.housing)),
      savings: Math.round(monthlyIncome * (customAllocation.savings ?? DEFAULT_ALLOCATIONS.savings)),
      food: Math.round(monthlyIncome * (customAllocation.food ?? DEFAULT_ALLOCATIONS.food)),
      transportation: Math.round(monthlyIncome * (customAllocation.transportation ?? DEFAULT_ALLOCATIONS.transportation)),
      entertainment: Math.round(monthlyIncome * (customAllocation.entertainment ?? DEFAULT_ALLOCATIONS.entertainment)),
      utilities: Math.round(monthlyIncome * (customAllocation.utilities ?? DEFAULT_ALLOCATIONS.utilities)),
      insurance: Math.round(monthlyIncome * (customAllocation.insurance ?? DEFAULT_ALLOCATIONS.insurance)),
      miscellaneous: Math.round(monthlyIncome * (customAllocation.miscellaneous ?? DEFAULT_ALLOCATIONS.miscellaneous))
    };

    // Calculate total allocated and remaining
    const totalAllocated = Object.values(allocations).reduce((sum, value) => sum + value, 0);
    const remaining = monthlyIncome - totalAllocated;

    return NextResponse.json({
      success: true,
      data: {
        ...allocations,
        totalAllocated,
        remaining
      }
    });
  } catch (error) {
    console.error('Budget calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process budget calculation' },
      { status: 500 }
    );
  }
}
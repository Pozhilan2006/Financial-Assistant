import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface InvestmentCalculationRequest {
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
  customReturns?: {
    stocks?: number;
    bonds?: number;
    cash?: number;
    realEstate?: number;
  };
}

export interface InvestmentCalculationResponse {
  success: boolean;
  data: {
    projectedValue: number;
    totalContributions: number;
    totalGrowth: number;
    yearlyProjections: Array<{
      year: number;
      value: number;
      contributions: number;
      growth: number;
    }>;
    allocationReturns: {
      stocks: number;
      bonds: number;
      cash: number;
      realEstate: number;
      blended: number;
    };
    recommendations: string[];
    riskAnalysis?: {
      volatility: 'low' | 'medium' | 'high';
      potentialDownside: number;
      potentialUpside: number;
    };
  };
  message?: string;
}

// Default annual return rates by asset class
const DEFAULT_RETURNS = {
  stocks: {
    low: 6,
    medium: 8,
    high: 10
  },
  bonds: {
    low: 2,
    medium: 3.5,
    high: 5
  },
  cash: {
    low: 1,
    medium: 1.5,
    high: 2
  },
  realEstate: {
    low: 4,
    medium: 6,
    high: 8
  }
};

// Default allocations by risk profile
const DEFAULT_ALLOCATIONS = {
  low: {
    stocks: 30,
    bonds: 50,
    cash: 15,
    realEstate: 5
  },
  medium: {
    stocks: 60,
    bonds: 25,
    cash: 5,
    realEstate: 10
  },
  high: {
    stocks: 80,
    bonds: 10,
    cash: 0,
    realEstate: 10
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: InvestmentCalculationRequest = await request.json();
    
    if (
      body.initialInvestment === undefined || 
      body.monthlyContribution === undefined || 
      body.years === undefined
    ) {
      return NextResponse.json(
        { success: false, message: 'Initial investment, monthly contribution, and years are required' },
        { status: 400 }
      );
    }

    const { 
      initialInvestment, 
      monthlyContribution, 
      years,
      riskProfile = 'medium',
      allocation = DEFAULT_ALLOCATIONS[riskProfile],
      customReturns = {}
    } = body;
    
    // Ensure allocation percentages sum to 100
    const totalAllocation = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    const normalizedAllocation = totalAllocation === 100 
      ? allocation 
      : Object.fromEntries(
          Object.entries(allocation).map(([key, value]) => [key, (value / totalAllocation) * 100])
        );
    
    // Calculate blended return rate based on allocation and risk profile
    const returns = {
      stocks: customReturns.stocks ?? DEFAULT_RETURNS.stocks[riskProfile],
      bonds: customReturns.bonds ?? DEFAULT_RETURNS.bonds[riskProfile],
      cash: customReturns.cash ?? DEFAULT_RETURNS.cash[riskProfile],
      realEstate: customReturns.realEstate ?? DEFAULT_RETURNS.realEstate[riskProfile]
    };
    
    const blendedAnnualReturn = (
      (normalizedAllocation.stocks * returns.stocks) +
      (normalizedAllocation.bonds * returns.bonds) +
      (normalizedAllocation.cash * returns.cash) +
      (normalizedAllocation.realEstate * returns.realEstate)
    ) / 100;
    
    // Calculate monthly return rate
    const monthlyReturnRate = blendedAnnualReturn / 100 / 12;
    
    // Calculate investment growth
    let currentValue = initialInvestment;
    let totalContributions = initialInvestment;
    const yearlyProjections = [];
    
    for (let year = 1; year <= years; year++) {
      // Calculate for each month of the year
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution
        currentValue += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Apply monthly growth
        currentValue *= (1 + monthlyReturnRate);
      }
      
      // Record yearly projection
      yearlyProjections.push({
        year,
        value: Math.round(currentValue),
        contributions: Math.round(totalContributions),
        growth: Math.round(currentValue - totalContributions)
      });
    }
    
    // Calculate risk analysis
    const volatility = riskProfile;
    const potentialDownside = calculatePotentialDownside(blendedAnnualReturn, riskProfile);
    const potentialUpside = calculatePotentialUpside(blendedAnnualReturn, riskProfile);
    
    // Generate recommendations
    const recommendations = generateRecommendations(
      normalizedAllocation,
      riskProfile,
      years,
      blendedAnnualReturn,
      monthlyContribution,
      currentValue,
      totalContributions
    );

    return NextResponse.json({
      success: true,
      data: {
        projectedValue: Math.round(currentValue),
        totalContributions: Math.round(totalContributions),
        totalGrowth: Math.round(currentValue - totalContributions),
        yearlyProjections,
        allocationReturns: {
          stocks: returns.stocks,
          bonds: returns.bonds,
          cash: returns.cash,
          realEstate: returns.realEstate,
          blended: blendedAnnualReturn
        },
        recommendations,
        riskAnalysis: {
          volatility,
          potentialDownside,
          potentialUpside
        }
      }
    });
  } catch (error) {
    console.error('Investment calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process investment calculation' },
      { status: 500 }
    );
  }
}

// Helper function to calculate potential downside
function calculatePotentialDownside(blendedReturn: number, riskProfile: 'low' | 'medium' | 'high'): number {
  // Simplified model based on historical market downturns
  const volatilityFactor = {
    low: 0.5,
    medium: 1.0,
    high: 1.5
  };
  
  // Higher returns typically come with higher volatility
  return Math.round(blendedReturn * volatilityFactor[riskProfile] * -1);
}

// Helper function to calculate potential upside
function calculatePotentialUpside(blendedReturn: number, riskProfile: 'low' | 'medium' | 'high'): number {
  // Simplified model based on historical market upturns
  const upsideFactor = {
    low: 1.2,
    medium: 1.5,
    high: 2.0
  };
  
  return Math.round(blendedReturn * upsideFactor[riskProfile]);
}

// Helper function to generate investment recommendations
function generateRecommendations(
  allocation: any,
  riskProfile: 'low' | 'medium' | 'high',
  years: number,
  blendedReturn: number,
  monthlyContribution: number,
  projectedValue: number,
  totalContributions: number
): string[] {
  const recommendations: string[] = [];
  
  // Recommendation based on investment horizon
  if (years < 5 && riskProfile === 'high') {
    recommendations.push(
      "Your investment horizon is relatively short for a high-risk portfolio. Consider increasing your bond allocation for more stability."
    );
  } else if (years > 15 && riskProfile === 'low') {
    recommendations.push(
      "With your long investment horizon, you might consider increasing your stock allocation to potentially achieve higher returns."
    );
  }
  
  // Recommendation based on allocation
  if (allocation.cash > 20) {
    recommendations.push(
      "Your cash allocation is relatively high. Consider reducing cash and increasing investments in stocks or bonds for potentially higher returns."
    );
  }
  
  if (allocation.stocks < 20 && years > 10) {
    recommendations.push(
      "For a long-term investment horizon, consider increasing your stock allocation to potentially benefit from higher growth."
    );
  }
  
  // Recommendation based on monthly contribution
  const growthPercentage = ((projectedValue - totalContributions) / totalContributions) * 100;
  if (growthPercentage > 100) {
    recommendations.push(
      `Your investment strategy is projected to more than double your contributions over ${years} years. Stay consistent with your monthly contributions to maximize growth.`
    );
  }
  
  // Add diversification recommendation
  if (Object.values(allocation).some(value => value > 70)) {
    recommendations.push(
      "Your portfolio appears to be heavily concentrated in one asset class. Consider diversifying more to reduce risk."
    );
  }
  
  // Add general recommendation if we don't have many specific ones
  if (recommendations.length < 2) {
    recommendations.push(
      "Regular rebalancing of your portfolio helps maintain your target allocation and manage risk. Consider reviewing your investments quarterly."
    );
  }
  
  return recommendations;
}
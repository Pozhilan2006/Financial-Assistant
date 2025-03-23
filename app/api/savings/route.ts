import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface SavingsCalculationRequest {
  currentSavings: number;
  monthlySavings: number;
  savingsGoal?: number;
  targetDate?: string;
  interestRate?: number;
}

export interface SavingsCalculationResponse {
  success: boolean;
  data: {
    timeToGoal?: number; // in months
    monthlyAmountNeeded?: number;
    projectedSavings?: number;
    savingsWithInterest?: number;
    interestEarned?: number;
    monthlyMilestones?: Array<{
      month: number;
      savings: number;
      interest: number;
      total: number;
    }>;
    recommendations: string[];
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SavingsCalculationRequest = await request.json();
    
    if (body.currentSavings === undefined || body.monthlySavings === undefined) {
      return NextResponse.json(
        { success: false, message: 'Current savings and monthly savings are required' },
        { status: 400 }
      );
    }

    const { 
      currentSavings, 
      monthlySavings, 
      savingsGoal, 
      targetDate,
      interestRate = 0 // Default to 0% if not provided
    } = body;
    
    const response: SavingsCalculationResponse = {
      success: true,
      data: {
        recommendations: []
      }
    };
    
    // Calculate time to goal if savings goal is provided
    if (savingsGoal !== undefined && savingsGoal > 0) {
      if (monthlySavings <= 0) {
        response.data.timeToGoal = Infinity;
        response.data.recommendations.push(
          "Your monthly savings amount is too low. Consider increasing your monthly savings to reach your goal."
        );
      } else {
        // Calculate months to reach goal without interest
        const remainingToSave = Math.max(0, savingsGoal - currentSavings);
        const monthsToGoalSimple = Math.ceil(remainingToSave / monthlySavings);
        
        // Calculate with interest if provided
        if (interestRate > 0) {
          const monthlyInterestRate = interestRate / 100 / 12;
          let accumulated = currentSavings;
          let months = 0;
          const milestones: Array<{month: number; savings: number; interest: number; total: number}> = [];
          
          while (accumulated < savingsGoal && months < 600) { // Cap at 50 years
            const interestEarned = accumulated * monthlyInterestRate;
            accumulated += monthlySavings + interestEarned;
            months++;
            
            // Record milestone every 6 months
            if (months % 6 === 0 || months === 1 || accumulated >= savingsGoal) {
              milestones.push({
                month: months,
                savings: months * monthlySavings,
                interest: accumulated - currentSavings - (months * monthlySavings),
                total: accumulated
              });
            }
          }
          
          response.data.timeToGoal = months;
          response.data.monthlyMilestones = milestones;
          
          // Compare with simple calculation
          if (months < monthsToGoalSimple) {
            response.data.recommendations.push(
              `With a ${interestRate}% annual interest rate, you'll reach your goal ${monthsToGoalSimple - months} months sooner than without interest.`
            );
          }
        } else {
          response.data.timeToGoal = monthsToGoalSimple;
        }
        
        // Add recommendation based on time to goal
        if (response.data.timeToGoal > 60) { // More than 5 years
          response.data.recommendations.push(
            "It will take over 5 years to reach your goal. Consider increasing your monthly savings or exploring investment options with higher returns."
          );
        } else if (response.data.timeToGoal < 12) { // Less than a year
          response.data.recommendations.push(
            "You're on track to reach your goal within a year. Great job!"
          );
        }
      }
    }
    
    // Calculate monthly amount needed if target date is provided
    if (targetDate) {
      const targetDateTime = new Date(targetDate).getTime();
      const currentTime = new Date().getTime();
      
      if (targetDateTime > currentTime) {
        const monthsDifference = Math.ceil((targetDateTime - currentTime) / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
        
        if (savingsGoal !== undefined && savingsGoal > 0) {
          const remainingToSave = Math.max(0, savingsGoal - currentSavings);
          
          if (interestRate > 0) {
            // Calculate with compound interest
            const monthlyInterestRate = interestRate / 100 / 12;
            
            // Use financial formula to calculate monthly payment needed
            // P = PMT * ((1 - (1 + r)^-n) / r)
            // Solving for PMT: PMT = P * r / (1 - (1 + r)^-n)
            const denominator = 1 - Math.pow(1 + monthlyInterestRate, -monthsDifference);
            
            if (denominator !== 0) {
              response.data.monthlyAmountNeeded = remainingToSave * monthlyInterestRate / denominator;
            } else {
              // Fallback to simple calculation if denominator is zero
              response.data.monthlyAmountNeeded = remainingToSave / monthsDifference;
            }
          } else {
            // Simple calculation without interest
            response.data.monthlyAmountNeeded = remainingToSave / monthsDifference;
          }
          
          // Round to 2 decimal places
          response.data.monthlyAmountNeeded = Math.ceil(response.data.monthlyAmountNeeded);
          
          // Add recommendation based on monthly amount needed vs current savings
          if (response.data.monthlyAmountNeeded > monthlySavings) {
            const difference = response.data.monthlyAmountNeeded - monthlySavings;
            response.data.recommendations.push(
              `To reach your goal by the target date, you need to increase your monthly savings by ₹${difference.toLocaleString()}.`
            );
          } else {
            response.data.recommendations.push(
              "You're on track to reach your savings goal by the target date. Keep it up!"
            );
          }
        }
      } else {
        return NextResponse.json(
          { success: false, message: 'Target date must be in the future' },
          { status: 400 }
        );
      }
    }
    
    // Calculate projected savings for 1, 5, and 10 years
    const projectedYears = 10;
    const monthlyInterestRate = interestRate / 100 / 12;
    let accumulated = currentSavings;
    
    // Calculate with compound interest
    for (let month = 1; month <= projectedYears * 12; month++) {
      const interestEarned = accumulated * monthlyInterestRate;
      accumulated += monthlySavings + interestEarned;
    }
    
    response.data.projectedSavings = currentSavings + (monthlySavings * projectedYears * 12);
    response.data.savingsWithInterest = accumulated;
    response.data.interestEarned = accumulated - response.data.projectedSavings;
    
    // Add recommendation based on interest earned
    if (response.data.interestEarned > 0) {
      response.data.recommendations.push(
        `Over ${projectedYears} years, you'll earn approximately ₹${Math.round(response.data.interestEarned).toLocaleString()} in interest at the current rate.`
      );
    }
    
    // Add general recommendation if we don't have many specific ones
    if (response.data.recommendations.length < 2) {
      response.data.recommendations.push(
        "Consider setting up automatic transfers to your savings account to maintain consistent savings habits."
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Savings calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process savings calculation' },
      { status: 500 }
    );
  }
}
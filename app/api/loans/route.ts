import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface LoanCalculationRequest {
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  loanType?: 'mortgage' | 'personal' | 'auto' | 'education';
  downPayment?: number;
  extraPayment?: number;
}

export interface LoanCalculationResponse {
  success: boolean;
  data: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortizationSchedule: Array<{
      period: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
    payoffDate: string;
    interestSavings?: number;
    timeShortened?: number; // in months
    recommendations: string[];
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoanCalculationRequest = await request.json();
    
    if (
      body.loanAmount === undefined || 
      body.interestRate === undefined || 
      body.loanTerm === undefined
    ) {
      return NextResponse.json(
        { success: false, message: 'Loan amount, interest rate, and loan term are required' },
        { status: 400 }
      );
    }

    const { 
      loanAmount, 
      interestRate, 
      loanTerm,
      loanType = 'mortgage',
      downPayment = 0,
      extraPayment = 0
    } = body;
    
    // Calculate loan amount after down payment
    const principalAmount = loanAmount - downPayment;
    
    // Calculate monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // Calculate number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // Where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
    const monthlyPayment = principalAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principalAmount;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    let remainingBalance = principalAmount;
    let currentDate = new Date();
    
    // Calculate standard amortization
    for (let period = 1; period <= numberOfPayments; period++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      // Only include yearly entries to keep the response size manageable
      if (period % 12 === 0 || period === 1 || period === numberOfPayments) {
        amortizationSchedule.push({
          period,
          payment: parseFloat(monthlyPayment.toFixed(2)),
          principal: parseFloat(principalPayment.toFixed(2)),
          interest: parseFloat(interestPayment.toFixed(2)),
          balance: parseFloat(Math.max(0, remainingBalance).toFixed(2))
        });
      }
    }
    
    // Calculate payoff date
    const payoffDate = new Date(currentDate);
    payoffDate.setMonth(payoffDate.getMonth() + numberOfPayments);
    
    // Calculate with extra payment if provided
    let extraPaymentSavings = null;
    if (extraPayment > 0) {
      let remainingBalanceWithExtra = principalAmount;
      let periodsWithExtra = 0;
      let totalInterestWithExtra = 0;
      
      while (remainingBalanceWithExtra > 0 && periodsWithExtra < numberOfPayments) {
        periodsWithExtra++;
        const interestPayment = remainingBalanceWithExtra * monthlyInterestRate;
        totalInterestWithExtra += interestPayment;
        
        // Regular payment plus extra payment
        const principalPayment = Math.min(
          remainingBalanceWithExtra,
          monthlyPayment - interestPayment + extraPayment
        );
        
        remainingBalanceWithExtra -= principalPayment;
      }
      
      extraPaymentSavings = {
        interestSavings: totalInterest - totalInterestWithExtra,
        timeShortened: numberOfPayments - periodsWithExtra
      };
    }
    
    // Generate recommendations
    const recommendations = generateLoanRecommendations(
      loanType,
      interestRate,
      loanTerm,
      monthlyPayment,
      extraPayment,
      extraPaymentSavings
    );

    return NextResponse.json({
      success: true,
      data: {
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalPayment: parseFloat(totalPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        amortizationSchedule,
        payoffDate: payoffDate.toISOString().split('T')[0],
        interestSavings: extraPaymentSavings?.interestSavings 
          ? parseFloat(extraPaymentSavings.interestSavings.toFixed(2)) 
          : undefined,
        timeShortened: extraPaymentSavings?.timeShortened,
        recommendations
      }
    });
  } catch (error) {
    console.error('Loan calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process loan calculation' },
      { status: 500 }
    );
  }
}

// Helper function to generate loan recommendations
function generateLoanRecommendations(
  loanType: string,
  interestRate: number,
  loanTerm: number,
  monthlyPayment: number,
  extraPayment: number,
  extraPaymentSavings: any
): string[] {
  const recommendations: string[] = [];
  
  // Recommendation based on interest rate
  if (loanType === 'mortgage' && interestRate > 6) {
    recommendations.push(
      "Your mortgage interest rate is relatively high compared to current market rates. Consider exploring refinancing options to potentially lower your rate."
    );
  } else if (loanType === 'personal' && interestRate > 10) {
    recommendations.push(
      "Personal loan rates can vary widely. With your current rate, you might benefit from consolidating with a lower-rate option if your credit score has improved."
    );
  }
  
  // Recommendation based on loan term
  if (loanType === 'mortgage' && loanTerm > 15) {
    recommendations.push(
      "While a longer-term mortgage offers lower monthly payments, you'll pay significantly more in interest over time. Consider if a 15-year term might be manageable for substantial interest savings."
    );
  }
  
  // Recommendation based on extra payments
  if (extraPayment > 0 && extraPaymentSavings) {
    const yearsSaved = Math.floor(extraPaymentSavings.timeShortened / 12);
    const monthsSaved = extraPaymentSavings.timeShortened % 12;
    
    let timeString = "";
    if (yearsSaved > 0) {
      timeString += `${yearsSaved} year${yearsSaved > 1 ? 's' : ''}`;
    }
    if (monthsSaved > 0) {
      timeString += timeString ? ` and ${monthsSaved} month${monthsSaved > 1 ? 's' : ''}` : `${monthsSaved} month${monthsSaved > 1 ? 's' : ''}`;
    }
    
    recommendations.push(
      `By making an extra payment of ₹${extraPayment.toLocaleString()} each month, you'll save approximately ₹${Math.round(extraPaymentSavings.interestSavings).toLocaleString()} in interest and pay off your loan ${timeString} earlier.`
    );
  } else {
    recommendations.push(
      "Consider making extra payments toward your principal when possible. Even small additional amounts can significantly reduce your total interest and shorten your loan term."
    );
  }
  
  // Recommendation based on loan type
  if (loanType === 'education') {
    recommendations.push(
      "Education loans may have special repayment options or forgiveness programs. Research if you qualify for income-driven repayment plans or public service loan forgiveness."
    );
  } else if (loanType === 'auto') {
    recommendations.push(
      "Auto loans are secured by your vehicle, which typically results in lower interest rates than unsecured debt. If you have high-interest credit card debt, prioritize paying that off before making extra payments on your auto loan."
    );
  }
  
  // Add general recommendation if we don't have many specific ones
  if (recommendations.length < 2) {
    recommendations.push(
      "Setting up automatic payments can help ensure you never miss a payment, which is crucial for maintaining a good credit score and avoiding late fees."
    );
  }
  
  return recommendations;
}
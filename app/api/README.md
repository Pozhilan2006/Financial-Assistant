# Finance App API Routes

This directory contains the backend API routes for the Finance App. These routes handle financial calculations and data processing, providing a secure and efficient way to perform complex operations without relying on external APIs.

## Available API Routes

### Budget API
**Endpoint:** `/api/budget`
**Method:** POST
**Description:** Calculates budget allocations based on monthly income.
**Request Body:**
```json
{
  "monthlyIncome": 5000,
  "customAllocation": {
    "housing": 0.25,
    "savings": 0.3
    // Other categories optional
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "housing": 1250,
    "savings": 1500,
    "food": 750,
    "transportation": 500,
    "entertainment": 500,
    "utilities": 250,
    "insurance": 250,
    "miscellaneous": 250,
    "totalAllocated": 5000,
    "remaining": 0
  }
}
```

### Expenses API
**Endpoint:** `/api/expenses`
**Method:** POST
**Description:** Analyzes expenses and provides insights.
**Request Body:**
```json
{
  "expenses": [
    {
      "category": "housing",
      "amount": 1500,
      "date": "2023-05-15",
      "description": "Monthly rent"
    }
  ],
  "monthlyIncome": 5000,
  "budgetLimits": {
    "housing": 1500,
    "food": 800
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalExpenses": 1500,
    "categoryBreakdown": {
      "housing": 1500
    },
    "categoryPercentages": {
      "housing": 100
    },
    "topCategories": [
      {
        "category": "housing",
        "amount": 1500,
        "percentage": 100
      }
    ],
    "budgetStatus": {
      "housing": {
        "limit": 1500,
        "spent": 1500,
        "remaining": 0,
        "percentUsed": 100
      }
    },
    "savingsRate": 70,
    "recommendations": [
      "Your savings rate of 70% is excellent! You might consider investing some of your savings for long-term growth."
    ]
  }
}
```

### Savings API
**Endpoint:** `/api/savings`
**Method:** POST
**Description:** Calculates savings projections and provides recommendations.
**Request Body:**
```json
{
  "currentSavings": 10000,
  "monthlySavings": 1000,
  "savingsGoal": 50000,
  "targetDate": "2025-12-31",
  "interestRate": 4
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "timeToGoal": 36,
    "monthlyAmountNeeded": 1112,
    "projectedSavings": 46000,
    "savingsWithInterest": 49876,
    "interestEarned": 3876,
    "monthlyMilestones": [
      {
        "month": 6,
        "savings": 6000,
        "interest": 612,
        "total": 16612
      }
    ],
    "recommendations": [
      "To reach your goal by the target date, you need to increase your monthly savings by ₹112."
    ]
  }
}
```

### Investments API
**Endpoint:** `/api/investments`
**Method:** POST
**Description:** Calculates investment projections and provides recommendations.
**Request Body:**
```json
{
  "initialInvestment": 10000,
  "monthlyContribution": 500,
  "years": 10,
  "riskProfile": "medium",
  "allocation": {
    "stocks": 60,
    "bonds": 25,
    "cash": 5,
    "realEstate": 10
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "projectedValue": 103245,
    "totalContributions": 70000,
    "totalGrowth": 33245,
    "yearlyProjections": [
      {
        "year": 1,
        "value": 16675,
        "contributions": 16000,
        "growth": 675
      }
    ],
    "allocationReturns": {
      "stocks": 8,
      "bonds": 3.5,
      "cash": 1.5,
      "realEstate": 6,
      "blended": 6.175
    },
    "recommendations": [
      "Regular rebalancing of your portfolio helps maintain your target allocation and manage risk. Consider reviewing your investments quarterly."
    ],
    "riskAnalysis": {
      "volatility": "medium",
      "potentialDownside": -6,
      "potentialUpside": 9
    }
  }
}
```

### Loans API
**Endpoint:** `/api/loans`
**Method:** POST
**Description:** Calculates loan payments, amortization schedules, and provides recommendations.
**Request Body:**
```json
{
  "loanAmount": 200000,
  "interestRate": 5.5,
  "loanTerm": 30,
  "loanType": "mortgage",
  "downPayment": 40000,
  "extraPayment": 100
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyPayment": 909.46,
    "totalPayment": 327405.60,
    "totalInterest": 167405.60,
    "amortizationSchedule": [
      {
        "period": 1,
        "payment": 909.46,
        "principal": 159.46,
        "interest": 750.00,
        "balance": 159840.54
      }
    ],
    "payoffDate": "2053-05-15",
    "interestSavings": 25380.42,
    "timeShortened": 48,
    "recommendations": [
      "By making an extra payment of ₹100 each month, you'll save approximately ₹25,380 in interest and pay off your loan 4 years earlier."
    ]
  }
}
```

## Error Handling

All API routes include error handling and will return appropriate error messages if the request is invalid or if there's a server error.

Example error response:
```json
{
  "success": false,
  "message": "Monthly income must be a positive number"
}
```

## Implementation Notes

- All calculations are performed on the server side to ensure consistency and security.
- The API routes include fallback calculations in case of errors.
- The routes are designed to be self-contained and don't rely on external services.
- All financial calculations use standard formulas and best practices.
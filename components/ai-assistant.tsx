"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, X, Sparkles, Bot, User, Loader2, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { notificationAnimation, listContainer, listItem } from "@/lib/advanced-animations"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  BarChart,
  HelpCircle,
  Settings,
  Award,
  AlertCircle,
  DollarSign
} from "lucide-react"

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isError?: boolean;
  hasAction?: boolean;
  actionType?: 'calculator' | 'investment' | 'savings' | 'budget';
  actionData?: any;
}

interface UserProfile {
  name: string;
  monthlyIncome: number;
  monthlySavings: number;
  savingsGoal: number;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    realEstate: number;
  };
  expenses: {
    housing: number;
    food: number;
    transportation: number;
    entertainment: number;
    utilities: number;
    other: number;
  };
  achievements: string[];
  points: number;
}

export function AIAssistant({ onClose }: { onClose: () => void }) {
  // Basic state
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your AI financial assistant powered by advanced analytics. I can help you manage your finances, create budgets, track investments, and provide personalized financial advice.",
      role: "assistant",
      timestamp: new Date()
    },
    {
      id: "welcome-2",
      content: "To get started, I'll need to understand your financial situation better. Would you like to set up your profile or jump straight into a conversation?",
      role: "assistant",
      timestamp: new Date(Date.now() + 100)
    }
  ])

  // User profile with mock data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex",
    monthlyIncome: 5000,
    monthlySavings: 1000,
    savingsGoal: 50000,
    riskTolerance: 'medium',
    investmentAllocation: {
      stocks: 60,
      bonds: 20,
      cash: 10,
      realEstate: 10
    },
    expenses: {
      housing: 1500,
      food: 800,
      transportation: 400,
      entertainment: 300,
      utilities: 200,
      other: 800
    },
    achievements: ["First Budget Created", "Savings Goal Set"],
    points: 120
  })

  // Feature states
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null)
  const [calculatorData, setCalculatorData] = useState({
    loanAmount: 200000,
    interestRate: 5.5,
    loanTerm: 30,
    monthlyPayment: 1135.58
  })

  // UI states
  const [showConfetti, setShowConfetti] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [apiCallCount, setApiCallCount] = useState(0)

  // Suggestions based on user profile
  const [suggestions] = useState([
    "How can I reach my savings goal faster?",
    "Analyze my spending patterns this month",
    "Optimize my investment portfolio",
    "Create a budget plan for vacation"
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Multiple useEffects for better organization
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Effect for gamification rewards
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      // Check if user has reached a milestone (every 5 interactions)
      if ((messages.filter(m => m.role === 'user').length % 5 === 0) &&
          messages.filter(m => m.role === 'user').length > 0) {

        // Add points and show confetti
        setUserProfile(prev => ({
          ...prev,
          points: prev.points + 10
        }));

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Add achievement message
        const achievementMessage: Message = {
          id: `achievement-${Date.now()}`,
          content: "🎉 You've earned 10 points for consistent engagement! Keep asking questions to improve your financial knowledge.",
          role: 'system',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, achievementMessage]);
      }
    }
  }, [messages]);

  // Track API usage for optimization
  useEffect(() => {
    if (apiCallCount > 10) {
      console.log("High API usage detected. Consider implementing caching.");
    }
  }, [apiCallCount]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Hide onboarding after first message
    if (showOnboarding) {
      setShowOnboarding(false);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Increment API call counter
    setApiCallCount(prev => prev + 1);

    // Simulate API call with 2% chance of error for testing error handling
    const hasError = Math.random() < 0.02;

    // Simulate AI response after a delay
    setTimeout(() => {
      if (hasError) {
        handleError("Sorry, I encountered an issue processing your request. Let me try again.");
      } else {
        const response = getAIResponse(input.trim());

        // Check if response should include an interactive element
        const shouldIncludeAction = detectActionIntent(input.trim());

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          role: 'assistant',
          timestamp: new Date(),
          hasAction: shouldIncludeAction,
          actionType: response.actionType
        };

        setMessages(prev => [...prev, aiResponse]);

        // If action detected, activate the appropriate calculator or tool
        if (shouldIncludeAction && response.actionType) {
          setActiveCalculator(response.actionType);
        }
      }

      setIsThinking(false);
    }, 1500);
  };

  // Handle API errors gracefully
  const handleError = (errorMessage: string) => {
    setErrorCount(prev => prev + 1);

    const errorResponse: Message = {
      id: `error-${Date.now()}`,
      content: errorMessage,
      role: 'assistant',
      timestamp: new Date(),
      isError: true
    };

    setMessages(prev => [...prev, errorResponse]);

    // If multiple errors, suggest refresh
    if (errorCount >= 3) {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: "It seems we're having some technical difficulties. You might want to refresh the page or try again later.",
        role: 'system',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);
    }
  };

  // Detect if user query requires an interactive tool
  const detectActionIntent = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();

    const calculatorKeywords = ['calculate', 'calculator', 'compute', 'mortgage', 'loan', 'interest'];
    const investmentKeywords = ['invest', 'portfolio', 'stocks', 'bonds', 'allocation'];
    const savingsKeywords = ['save', 'saving', 'savings goal', 'emergency fund'];
    const budgetKeywords = ['budget', 'spending plan', 'expense', 'track expenses'];

    return calculatorKeywords.some(keyword => lowerQuery.includes(keyword)) ||
           investmentKeywords.some(keyword => lowerQuery.includes(keyword)) ||
           savingsKeywords.some(keyword => lowerQuery.includes(keyword)) ||
           budgetKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Enhanced AI response function with context awareness
  const getAIResponse = (query: string): { message: string, actionType?: 'calculator' | 'investment' | 'savings' | 'budget' } => {
    const lowerQuery = query.toLowerCase();

    // Personalize responses using user profile data
    const { name, monthlyIncome, monthlySavings, savingsGoal, riskTolerance, investmentAllocation, expenses } = userProfile;

    // Calculate some useful financial metrics for personalized responses
    const savingsRate = (monthlySavings / monthlyIncome) * 100;
    const monthsToGoal = savingsGoal / monthlySavings;
    const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);
    const discretionarySpending = expenses.entertainment + expenses.other;

    if (lowerQuery.includes('savings') || lowerQuery.includes('save')) {
      return {
        message: `Based on your profile ${name}, you're currently saving ₹${monthlySavings} per month (${savingsRate.toFixed(1)}% of your income). At this rate, you'll reach your savings goal of ₹${savingsGoal} in approximately ${Math.ceil(monthsToGoal)} months.\n\nI notice you're spending ₹${discretionarySpending} on discretionary items. Reducing this by 20% would allow you to save an additional ₹${Math.round(discretionarySpending * 0.2)} per month, helping you reach your goal ${Math.ceil(monthsToGoal * 0.8)} months sooner. Would you like me to create a detailed savings plan?`,
        actionType: 'savings'
      };
    } else if (lowerQuery.includes('spending') || lowerQuery.includes('expenses')) {
      return {
        message: `Here's a breakdown of your monthly expenses:\n\n• Housing: ₹${expenses.housing} (${((expenses.housing/totalExpenses)*100).toFixed(1)}%)\n• Food: ₹${expenses.food} (${((expenses.food/totalExpenses)*100).toFixed(1)}%)\n• Transportation: ₹${expenses.transportation} (${((expenses.transportation/totalExpenses)*100).toFixed(1)}%)\n• Entertainment: ₹${expenses.entertainment} (${((expenses.entertainment/totalExpenses)*100).toFixed(1)}%)\n• Utilities: ₹${expenses.utilities} (${((expenses.utilities/totalExpenses)*100).toFixed(1)}%)\n• Other: ₹${expenses.other} (${((expenses.other/totalExpenses)*100).toFixed(1)}%)\n\nYour entertainment expenses are ${expenses.entertainment > 300 ? 'higher' : 'lower'} than the average for your income level. Would you like to see a visualization of your spending patterns?`,
        actionType: 'budget'
      };
    } else if (lowerQuery.includes('investment') || lowerQuery.includes('invest') || lowerQuery.includes('portfolio')) {
      return {
        message: `Your current investment allocation is:\n\n• Stocks: ${investmentAllocation.stocks}%\n• Bonds: ${investmentAllocation.bonds}%\n• Real Estate: ${investmentAllocation.realEstate}%\n• Cash: ${investmentAllocation.cash}%\n\nBased on your ${riskTolerance} risk tolerance and financial goals, I recommend ${riskTolerance === 'high' ? 'increasing your stock allocation to 70%' : riskTolerance === 'medium' ? 'maintaining a balanced portfolio' : 'increasing your bond allocation for more stability'}. Would you like to see a simulation of how different allocations might perform over time?`,
        actionType: 'investment'
      };
    } else if (lowerQuery.includes('mortgage') || lowerQuery.includes('loan') || lowerQuery.includes('calculator')) {
      return {
        message: `I can help you calculate loan payments and amortization schedules. For a mortgage of ₹${calculatorData.loanAmount} at ${calculatorData.interestRate}% interest over ${calculatorData.loanTerm} years, your monthly payment would be approximately ₹${calculatorData.monthlyPayment}. Would you like to adjust these parameters or see a detailed breakdown?`,
        actionType: 'calculator'
      };
    } else if (lowerQuery.includes('budget') || lowerQuery.includes('plan')) {
      return {
        message: `Based on your monthly income of ₹${monthlyIncome}, I recommend the following budget allocation:\n\n• Housing: ₹${Math.round(monthlyIncome * 0.3)} (30%)\n• Savings: ₹${Math.round(monthlyIncome * 0.2)} (20%)\n• Food: ₹${Math.round(monthlyIncome * 0.15)} (15%)\n• Transportation: ₹${Math.round(monthlyIncome * 0.1)} (10%)\n• Entertainment: ₹${Math.round(monthlyIncome * 0.1)} (10%)\n• Utilities: ₹${Math.round(monthlyIncome * 0.05)} (5%)\n• Insurance: ₹${Math.round(monthlyIncome * 0.05)} (5%)\n• Miscellaneous: ₹${Math.round(monthlyIncome * 0.05)} (5%)\n\nWould you like me to create a customized budget plan based on your specific needs?`,
        actionType: 'budget'
      };
    } else if (lowerQuery.includes('profile') || lowerQuery.includes('my information')) {
      return {
        message: `Here's your financial profile, ${name}:\n\n• Monthly Income: ₹${monthlyIncome}\n• Monthly Savings: ₹${monthlySavings} (${savingsRate.toFixed(1)}% of income)\n• Savings Goal: ₹${savingsGoal}\n• Risk Tolerance: ${riskTolerance.charAt(0).toUpperCase() + riskTolerance.slice(1)}\n\nYou've earned ${userProfile.points} points and unlocked ${userProfile.achievements.length} achievements so far. Is there anything specific about your profile you'd like to update?`
      };
    } else {
      return {
        message: `I understand you're asking about "${query}". To provide the most accurate financial advice, I'll need to consider your specific situation.\n\nBased on your profile, you have a monthly income of ₹${monthlyIncome}, save ₹${monthlySavings} monthly, and have a ${riskTolerance} risk tolerance. Could you provide more specific details about your question so I can give you personalized advice?`
      };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  // Reset active calculator
  const closeCalculator = () => {
    setActiveCalculator(null);
  };

  // Update calculator data
  const updateCalculatorData = (field: string, value: number) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));

    // Recalculate mortgage payment if relevant fields changed
    if (['loanAmount', 'interestRate', 'loanTerm'].includes(field)) {
      const P = calculatorData.loanAmount;
      const r = calculatorData.interestRate / 100 / 12;
      const n = calculatorData.loanTerm * 12;

      // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
      const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      setCalculatorData(prev => ({
        ...prev,
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2))
      }));
    }
  };

  // Add achievement and points
  const addAchievement = (achievement: string, points: number) => {
    // Check if achievement already exists
    if (!userProfile.achievements.includes(achievement)) {
      setUserProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
        points: prev.points + points
      }));

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Add achievement message
      const achievementMessage: Message = {
        id: `achievement-${Date.now()}`,
        content: `🏆 Achievement unlocked: ${achievement}! You earned ${points} points.`,
        role: 'system',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, achievementMessage]);
    }
  };

  // Switch between tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // If switching to profile, add achievement for first profile view
    if (value === 'profile' && !userProfile.achievements.includes('Viewed Profile')) {
      addAchievement('Viewed Profile', 5);
    }
  };

  // Render calculator component based on type
  const renderCalculator = () => {
    if (!activeCalculator) return null;

    switch (activeCalculator) {
      case 'calculator':
        return (
          <div className="p-4 bg-muted/20 rounded-lg border border-primary/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-primary" />
                Loan Calculator
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Loan Amount (₹)</label>
                <Input
                  type="number"
                  value={calculatorData.loanAmount}
                  onChange={(e) => updateCalculatorData('loanAmount', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Interest Rate (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={calculatorData.interestRate}
                  onChange={(e) => updateCalculatorData('interestRate', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Loan Term (years)</label>
                <Input
                  type="number"
                  value={calculatorData.loanTerm}
                  onChange={(e) => updateCalculatorData('loanTerm', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Payment:</span>
                  <span className="text-lg font-bold">₹{calculatorData.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Total Payment:</span>
                  <span className="text-sm">₹{(calculatorData.monthlyPayment * calculatorData.loanTerm * 12).toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  addAchievement('Used Loan Calculator', 15);
                  closeCalculator();
                }}
              >
                Save Calculation
              </Button>
            </div>
          </div>
        );

      case 'investment':
        return (
          <div className="p-4 bg-muted/20 rounded-lg border border-primary/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                Investment Portfolio Simulator
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Stocks (%)</label>
                  <Input
                    type="number"
                    value={userProfile.investmentAllocation.stocks}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      investmentAllocation: {
                        ...prev.investmentAllocation,
                        stocks: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Bonds (%)</label>
                  <Input
                    type="number"
                    value={userProfile.investmentAllocation.bonds}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      investmentAllocation: {
                        ...prev.investmentAllocation,
                        bonds: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Real Estate (%)</label>
                  <Input
                    type="number"
                    value={userProfile.investmentAllocation.realEstate}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      investmentAllocation: {
                        ...prev.investmentAllocation,
                        realEstate: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Cash (%)</label>
                  <Input
                    type="number"
                    value={userProfile.investmentAllocation.cash}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      investmentAllocation: {
                        ...prev.investmentAllocation,
                        cash: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-md">
                <div className="text-sm mb-2">Projected 10-year growth:</div>
                <div className="h-8 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{ width: `${Math.min(userProfile.investmentAllocation.stocks * 1.2, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Lower Risk</span>
                  <span className="text-xs text-muted-foreground">Higher Risk</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  addAchievement('Optimized Investment Portfolio', 20);
                  closeCalculator();
                }}
              >
                Save Portfolio
              </Button>
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="p-4 bg-muted/20 rounded-lg border border-primary/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center">
                <PiggyBank className="h-4 w-4 mr-2 text-primary" />
                Savings Goal Calculator
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Savings Goal (₹)</label>
                <Input
                  type="number"
                  value={userProfile.savingsGoal}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    savingsGoal: parseFloat(e.target.value)
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Monthly Contribution (₹)</label>
                <Input
                  type="number"
                  value={userProfile.monthlySavings}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    monthlySavings: parseFloat(e.target.value)
                  }))}
                  className="mt-1"
                />
              </div>

              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Time to reach goal:</span>
                  <span className="text-lg font-bold">
                    {Math.ceil(userProfile.savingsGoal / userProfile.monthlySavings)} months
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Progress:</div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min((userProfile.monthlySavings * 10 / userProfile.savingsGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  addAchievement('Set Savings Goal', 10);
                  closeCalculator();
                }}
              >
                Save Goal
              </Button>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="p-4 bg-muted/20 rounded-lg border border-primary/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-primary" />
                Budget Planner
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Housing (₹)</label>
                  <Input
                    type="number"
                    value={userProfile.expenses.housing}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      expenses: {
                        ...prev.expenses,
                        housing: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Food (₹)</label>
                  <Input
                    type="number"
                    value={userProfile.expenses.food}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      expenses: {
                        ...prev.expenses,
                        food: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Transportation (₹)</label>
                  <Input
                    type="number"
                    value={userProfile.expenses.transportation}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      expenses: {
                        ...prev.expenses,
                        transportation: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Entertainment (₹)</label>
                  <Input
                    type="number"
                    value={userProfile.expenses.entertainment}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      expenses: {
                        ...prev.expenses,
                        entertainment: parseFloat(e.target.value)
                      }
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Expenses:</span>
                  <span className="text-lg font-bold">
                    ₹{Object.values(userProfile.expenses).reduce((sum, expense) => sum + expense, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Remaining Income:</span>
                  <span className="text-sm">
                    ₹{(userProfile.monthlyIncome - Object.values(userProfile.expenses).reduce((sum, expense) => sum + expense, 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  addAchievement('Created Budget Plan', 15);
                  closeCalculator();
                }}
              >
                Save Budget
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={`fixed right-6 shadow-xl z-50 overflow-hidden border-primary/20 transition-all duration-300 ${
        isExpanded
          ? "bottom-6 top-6 w-[400px] md:w-[450px]"
          : "bottom-24 w-80 md:w-96"
      }`}
    >
      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
          opacity: { duration: 0.5 },
          backgroundPosition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Confetti effect for achievements */}
      {showConfetti && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl"
            >
              🎉
            </motion.div>
          </div>
          {/* Confetti particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FF5555", "#55FF55", "#5555FF", "#FFFF55", "#FF55FF", "#55FFFF"][Math.floor(Math.random() * 6)]
              }}
              animate={{
                top: "110%",
                left: `${Math.random() * 100}%`,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Header with tabs */}
      <CardHeader className="flex flex-col p-0 bg-gradient-to-r from-primary/10 to-transparent backdrop-blur-sm relative z-10">
        <div className="flex items-center justify-between p-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Bot className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">AI Financial Assistant</CardTitle>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
              className="ml-2"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse-subtle" />
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-1">
            <Badge variant="outline" className="h-6 px-2 text-xs font-normal bg-primary/5 border-primary/20">
              <Award className="h-3 w-3 mr-1 text-primary" />
              {userProfile.points} pts
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="transition-transform duration-200 hover:rotate-90 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-10 bg-background/50 rounded-none border-y border-primary/10">
              <TabsTrigger value="chat" className="rounded-none data-[state=active]:bg-primary/10">
                <Bot className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="rounded-none data-[state=active]:bg-primary/10">
                <Calculator className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-none data-[state=active]:bg-primary/10">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="rounded-none data-[state=active]:bg-primary/10">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Help</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      {/* Main content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="chat" className="m-0">
            <ScrollArea className={`${isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-80'} relative z-10`} ref={scrollAreaRef}>
              <CardContent className="p-4">
                {/* Onboarding UI */}
                {showOnboarding && (
                  <motion.div
                    variants={listContainer}
                    initial="hidden"
                    animate="visible"
                    className="mb-6 space-y-4"
                  >
                    <motion.div variants={listItem} className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <h3 className="text-sm font-medium flex items-center mb-2">
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        Welcome to Your AI Financial Assistant
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I can help you manage your finances, create budgets, track investments, and provide personalized financial advice.
                      </p>
                    </motion.div>

                    <motion.div variants={listItem} className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                        <Calculator className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs">Financial Calculators</span>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                        <BarChart className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs">Budget Planning</span>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                        <TrendingUp className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs">Investment Advice</span>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                        <PiggyBank className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs">Savings Goals</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Chat messages */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'}`}
                      >
                        {message.role === 'system' ? (
                          <div className="bg-primary/5 text-xs rounded-lg p-2 border border-primary/10 max-w-[90%] text-center">
                            <p>{message.content}</p>
                          </div>
                        ) : (
                          <div
                            className={`flex max-w-[85%] ${
                              message.role === 'user'
                                ? 'bg-primary/20 rounded-lg rounded-tr-none ml-auto'
                                : message.isError
                                  ? 'bg-destructive/10 border border-destructive/20 rounded-lg rounded-tl-none'
                                  : 'bg-muted/30 rounded-lg rounded-tl-none'
                            } p-3`}
                          >
                            {message.role === 'assistant' && (
                              <div className="mr-2 mt-0.5">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                            )}

                            <div>
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>

                            {message.role === 'user' && (
                              <div className="ml-2 mt-0.5">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Thinking indicator */}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted/30 rounded-lg rounded-tl-none p-3 flex items-center">
                          <Bot className="h-4 w-4 text-primary mr-2" />
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">Thinking...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive calculators */}
                  {activeCalculator && renderCalculator()}
                </motion.div>
              </CardContent>
            </ScrollArea>

            {/* Suggestion chips */}
            {messages.length <= 2 && !isThinking && !activeCalculator && (
              <motion.div
                variants={notificationAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="px-4 pb-2"
              >
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs border-primary/20 hover:bg-primary/10"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Tools tab */}
          <TabsContent value="tools" className="m-0">
            <ScrollArea className={`${isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-80'} relative z-10`}>
              <CardContent className="p-4">
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.h3 variants={listItem} className="text-sm font-medium">
                    Financial Tools
                  </motion.h3>

                  <motion.div variants={listItem} className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-primary/20"
                      onClick={() => setActiveCalculator('calculator')}
                    >
                      <Calculator className="h-5 w-5 text-primary" />
                      <span className="text-xs">Loan Calculator</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-primary/20"
                      onClick={() => setActiveCalculator('investment')}
                    >
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-xs">Investment Simulator</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-primary/20"
                      onClick={() => setActiveCalculator('savings')}
                    >
                      <PiggyBank className="h-5 w-5 text-primary" />
                      <span className="text-xs">Savings Calculator</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-primary/20"
                      onClick={() => setActiveCalculator('budget')}
                    >
                      <BarChart className="h-5 w-5 text-primary" />
                      <span className="text-xs">Budget Planner</span>
                    </Button>
                  </motion.div>

                  <motion.h3 variants={listItem} className="text-sm font-medium mt-6">
                    Recent Calculations
                  </motion.h3>

                  <motion.div variants={listItem} className="bg-muted/20 rounded-lg p-3 text-sm">
                    <p className="text-muted-foreground text-xs text-center">No recent calculations</p>
                  </motion.div>
                </motion.div>
              </CardContent>
            </ScrollArea>
          </TabsContent>

          {/* Profile tab */}
          <TabsContent value="profile" className="m-0">
            <ScrollArea className={`${isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-80'} relative z-10`}>
              <CardContent className="p-4">
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.div variants={listItem} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{userProfile.name}</h3>
                      <p className="text-xs text-muted-foreground">Financial Profile</p>
                    </div>
                  </motion.div>

                  <motion.div variants={listItem} className="bg-muted/20 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium">Financial Summary</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Monthly Income</p>
                        <p className="text-lg font-bold">₹{userProfile.monthlyIncome.toLocaleString()}</p>
                      </div>

                      <div className="bg-background/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Monthly Savings</p>
                        <p className="text-lg font-bold">₹{userProfile.monthlySavings.toLocaleString()}</p>
                      </div>

                      <div className="bg-background/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Savings Goal</p>
                        <p className="text-lg font-bold">₹{userProfile.savingsGoal.toLocaleString()}</p>
                      </div>

                      <div className="bg-background/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Risk Tolerance</p>
                        <p className="text-lg font-bold capitalize">{userProfile.riskTolerance}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={listItem} className="bg-muted/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Achievements</h4>

                    <div className="space-y-2">
                      {userProfile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-xs">{achievement}</span>
                        </div>
                      ))}

                      {userProfile.achievements.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center">No achievements yet</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </ScrollArea>
          </TabsContent>

          {/* Help tab */}
          <TabsContent value="help" className="m-0">
            <ScrollArea className={`${isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-80'} relative z-10`}>
              <CardContent className="p-4">
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.h3 variants={listItem} className="text-sm font-medium">
                    How to Use the AI Financial Assistant
                  </motion.h3>

                  <motion.div variants={listItem} className="space-y-3">
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <h4 className="text-xs font-medium flex items-center">
                        <Bot className="h-3 w-3 mr-1 text-primary" />
                        Chat with the Assistant
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ask questions about your finances, request advice, or get help with financial planning.
                      </p>
                    </div>

                    <div className="bg-muted/20 p-3 rounded-lg">
                      <h4 className="text-xs font-medium flex items-center">
                        <Calculator className="h-3 w-3 mr-1 text-primary" />
                        Use Financial Tools
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Access calculators for loans, investments, savings goals, and budget planning.
                      </p>
                    </div>

                    <div className="bg-muted/20 p-3 rounded-lg">
                      <h4 className="text-xs font-medium flex items-center">
                        <Award className="h-3 w-3 mr-1 text-primary" />
                        Earn Achievements
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete financial tasks to earn points and unlock achievements.
                      </p>
                    </div>
                  </motion.div>

                  <motion.h3 variants={listItem} className="text-sm font-medium mt-4">
                    Example Questions
                  </motion.h3>

                  <motion.div variants={listItem} className="space-y-2">
                    {[
                      "How can I improve my savings rate?",
                      "What's the best way to invest ₹10,000?",
                      "Help me create a monthly budget",
                      "Calculate mortgage payments for a ₹30 lakh home loan",
                      "How much should I save for retirement?"
                    ].map((question, index) => (
                      <div
                        key={index}
                        className="bg-primary/5 p-2 rounded-md text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => handleSuggestionClick(question)}
                      >
                        {question}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </CardContent>
            </ScrollArea>
          </TabsContent>
        </motion.div>
      </AnimatePresence>

      {/* Input area */}
      <CardFooter className="p-4 border-t bg-background/80 backdrop-blur-sm relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances..."
            className="flex-1 bg-background/50 border-primary/20 focus-visible:ring-primary/30"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isThinking}
            className="bg-primary/90 text-primary-foreground hover:bg-primary transition-colors"
            animated
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/10 transition-colors"
            animated
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice input</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSummary, BudgetComparison } from '@/types';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface SpendingInsightsProps {
  dashboardData: DashboardSummary;
  budgetComparisons: BudgetComparison[];
  isLoading?: boolean;
}

export default function SpendingInsights({ 
  dashboardData, 
  budgetComparisons, 
  isLoading = false 
}: SpendingInsightsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const generateInsights = () => {
    const insights = [];

    // Top spending category insight
    if (dashboardData.categoryBreakdown.length > 0) {
      const topCategory = dashboardData.categoryBreakdown[0];
      insights.push({
        type: 'info',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Top Spending Category',
        description: `${topCategory.category} accounts for ${topCategory.percentage}% of your total expenses (${formatCurrency(topCategory.total)}).`,
        color: 'bg-blue-100 text-blue-800'
      });
    }

    // Budget insights
    const overBudgetCategories = budgetComparisons.filter(b => b.status === 'over');
    const underBudgetCategories = budgetComparisons.filter(b => b.status === 'under');

    if (overBudgetCategories.length > 0) {
      const totalOverspend = overBudgetCategories.reduce((sum, b) => sum + (b.actual - b.budgeted), 0);
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Over Budget Alert',
        description: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}, overspending by ${formatCurrency(totalOverspend)} total.`,
        color: 'bg-red-100 text-red-800'
      });
    }

    if (underBudgetCategories.length > 0) {
      const totalSavings = underBudgetCategories.reduce((sum, b) => sum + (b.budgeted - b.actual), 0);
      insights.push({
        type: 'success',
        icon: <CheckCircle className="h-4 w-4" />,
        title: 'Budget Savings',
        description: `Great job! You're under budget in ${underBudgetCategories.length} ${underBudgetCategories.length === 1 ? 'category' : 'categories'}, saving ${formatCurrency(totalSavings)} total.`,
        color: 'bg-green-100 text-green-800'
      });
    }

    // Monthly trend insight
    if (dashboardData.monthlyExpenses.length >= 2) {
      const currentMonth = dashboardData.monthlyExpenses[dashboardData.monthlyExpenses.length - 1];
      const previousMonth = dashboardData.monthlyExpenses[dashboardData.monthlyExpenses.length - 2];
      const change = currentMonth.total - previousMonth.total;
      const percentChange = ((change / previousMonth.total) * 100).toFixed(1);

      if (Math.abs(change) > 0.01) {
        insights.push({
          type: change > 0 ? 'warning' : 'success',
          icon: change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
          title: 'Monthly Trend',
          description: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${formatCurrency(Math.abs(change))} (${Math.abs(Number(percentChange))}%) compared to last month.`,
          color: change > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        });
      }
    }

    // Transaction frequency insight
    if (dashboardData.recentTransactions.length > 0) {
      const avgAmount = dashboardData.totalExpenses / dashboardData.recentTransactions.length;
      insights.push({
        type: 'info',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Spending Pattern',
        description: `You have ${dashboardData.recentTransactions.length} transactions with an average of ${formatCurrency(avgAmount)} per transaction.`,
        color: 'bg-blue-100 text-blue-800'
      });
    }

    return insights;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Add more transactions and set budgets to see personalized insights.
          </p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${insight.color}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


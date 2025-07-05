'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary as DashboardSummaryType } from '@/types';
import { DollarSign, TrendingUp, Clock, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardSummaryProps {
  data: DashboardSummaryType;
  isLoading: boolean;
}

export default function DashboardSummary({ data, isLoading }: DashboardSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="enhanced-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="skeleton h-4 w-24 rounded"></div>
              <div className="skeleton h-4 w-4 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="skeleton h-8 w-32 rounded mb-2"></div>
              <div className="skeleton h-3 w-20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Expenses Card */}
      <Card className="enhanced-card hover-lift group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatCurrency(data.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            Across all categories
          </p>
        </CardContent>
      </Card>

      {/* Top Category Card */}
      <Card className="enhanced-card hover-lift group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Category
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
            <PieChart className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {formatCurrency(data.topCategory.amount)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-medium text-slate-700">
              {data.topCategory.category}
            </p>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold text-green-600">
                {data.topCategory.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card className="enhanced-card hover-lift group overflow-hidden relative md:col-span-2 lg:col-span-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Transactions
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {data.recentTransactions.length}
          </div>
          <div className="space-y-3 max-h-32 overflow-y-auto custom-scrollbar">
            {data.recentTransactions.slice(0, 3).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {transaction.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {data.recentTransactions.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first transaction to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


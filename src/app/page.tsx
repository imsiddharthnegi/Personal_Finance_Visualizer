'use client';

import { useState, useEffect } from 'react';
import { Transaction, MonthlyExpense, DashboardSummary as DashboardSummaryType, Budget, BudgetComparison } from '@/types';
import TransactionForm from '@/components/finance/TransactionForm';
import TransactionList from '@/components/finance/TransactionList';
import MonthlyExpensesChart from '@/components/finance/MonthlyExpensesChart';
import DashboardSummary from '@/components/finance/DashboardSummary';
import CategoryPieChart from '@/components/finance/CategoryPieChart';
import BudgetManagement from '@/components/finance/BudgetManagement';
import BudgetComparisonChart from '@/components/finance/BudgetComparisonChart';
import SpendingInsights from '@/components/finance/SpendingInsights';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, PieChart, Target, Lightbulb, Wallet } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryType | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetComparisons, setBudgetComparisons] = useState<BudgetComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch monthly expenses
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await fetch('/api/analytics/monthly-expenses');
      if (response.ok) {
        const data = await response.json();
        setMonthlyExpenses(data);
      } else {
        console.error('Failed to fetch monthly expenses');
      }
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      } else {
        console.error('Failed to fetch budgets');
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  // Fetch budget comparisons
  const fetchBudgetComparisons = async () => {
    try {
      const response = await fetch(`/api/analytics/budget-comparison?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setBudgetComparisons(data);
      } else {
        console.error('Failed to fetch budget comparisons');
      }
    } catch (error) {
      console.error('Error fetching budget comparisons:', error);
    }
  };

  // Load all data
  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTransactions(),
      fetchMonthlyExpenses(),
      fetchDashboardData(),
      fetchBudgets(),
      fetchBudgetComparisons()
    ]);
    setIsLoading(false);
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await loadAllData(); // Refresh all data
        setIsAddDialogOpen(false);
      } else {
        const error = await response.json();
        console.error('Failed to add transaction:', error);
        alert('Failed to add transaction: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  // Update transaction
  const handleUpdateTransaction = async (id: string, transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await loadAllData(); // Refresh all data
      } else {
        const error = await response.json();
        console.error('Failed to update transaction:', error);
        alert('Failed to update transaction: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction. Please try again.');
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAllData(); // Refresh all data
      } else {
        const error = await response.json();
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    }
  };

  // Add budget
  const handleAddBudget = async (budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetComparisons()]);
      } else {
        const error = await response.json();
        console.error('Failed to add budget:', error);
        alert('Failed to add budget: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Error adding budget. Please try again.');
    }
  };

  // Update budget
  const handleUpdateBudget = async (id: string, budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetComparisons()]);
      } else {
        const error = await response.json();
        console.error('Failed to update budget:', error);
        alert('Failed to update budget: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Error updating budget. Please try again.');
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetComparisons()]);
      } else {
        const error = await response.json();
        console.error('Failed to delete budget:', error);
        alert('Failed to delete budget: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Error deleting budget. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Gradient */}
      <div className="gradient-bg text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Personal Finance Visualizer
                </h1>
              </div>
              <p className="text-xl text-blue-100 max-w-2xl">
                Track expenses, set budgets, and visualize your spending patterns with beautiful charts and insights
              </p>
              <div className="flex items-center gap-4 mt-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-blue-100">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Target className="h-5 w-5" />
                  <span className="text-sm">Budget Tracking</span>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary hover-lift px-8 py-3 text-lg font-semibold rounded-full shadow-lg animate-scale-in">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Add New Transaction</DialogTitle>
                </DialogHeader>
                <TransactionForm
                  onSubmit={handleAddTransaction}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-full p-2">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 rounded-full transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="flex items-center gap-2 rounded-full transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="budgets"
              className="flex items-center gap-2 rounded-full transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Budgets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="flex items-center gap-2 rounded-full transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            {/* Dashboard Summary Cards */}
            {dashboardData && (
              <div className="animate-slide-in">
                <DashboardSummary 
                  data={dashboardData} 
                  isLoading={isLoading} 
                />
              </div>
            )}

            {/* Charts Row */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Monthly Expenses Chart */}
              <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <MonthlyExpensesChart 
                  data={monthlyExpenses} 
                  isLoading={isLoading} 
                />
              </div>

              {/* Category Pie Chart */}
              {dashboardData && (
                <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                  <CategoryPieChart 
                    data={dashboardData.categoryBreakdown} 
                    isLoading={isLoading} 
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8 animate-fade-in">
            <TransactionList
              transactions={transactions}
              onUpdate={handleUpdateTransaction}
              onDelete={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-8 animate-fade-in">
            <div className="grid gap-8">
              <div className="animate-slide-in">
                <BudgetManagement
                  budgets={budgets}
                  currentMonth={currentMonth}
                  onAdd={handleAddBudget}
                  onUpdate={handleUpdateBudget}
                  onDelete={handleDeleteBudget}
                  isLoading={isLoading}
                />
              </div>
              
              {budgetComparisons.length > 0 && (
                <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                  <BudgetComparisonChart
                    data={budgetComparisons}
                    month={currentMonth}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-8 animate-fade-in">
            {dashboardData && (
              <div className="animate-slide-in">
                <SpendingInsights
                  dashboardData={dashboardData}
                  budgetComparisons={budgetComparisons}
                  isLoading={isLoading}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-semibold">Personal Finance Visualizer</span>
          </div>
          <p className="text-slate-400">
            Built with Next.js, React, shadcn/ui, Recharts, and MongoDB
          </p>
          <p className="text-slate-500 text-sm mt-2">
            © 2025 Personal Finance Visualizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


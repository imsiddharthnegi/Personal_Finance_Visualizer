'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MonthlyExpense } from '@/types';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface MonthlyExpensesChartProps {
  data: MonthlyExpense[];
  isLoading: boolean;
}

export default function MonthlyExpensesChart({ data, isLoading }: MonthlyExpensesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Total Expenses:</span>
            <span className="font-bold text-lg text-gray-900">{formatCurrency(payload[0].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate gradient colors for bars
  const getBarColor = (index: number) => {
    const colors = [
      'url(#gradient1)',
      'url(#gradient2)',
      'url(#gradient3)',
      'url(#gradient4)',
      'url(#gradient5)',
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monthly Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="skeleton h-4 w-32 rounded mx-auto"></div>
              <div className="flex items-end justify-center gap-4 h-48">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton rounded" style={{ 
                    width: '40px', 
                    height: `${Math.random() * 120 + 40}px` 
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalExpenses = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const averageExpenses = data.length > 0 ? totalExpenses / data.length : 0;

  return (
    <Card className="enhanced-card hover-lift group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Monthly Expenses
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(averageExpenses)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {data.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No expense data yet</h3>
            <p className="text-gray-500">Add some transactions to see your monthly spending trends</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="gradient4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="gradient5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonth}
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalAmount" 
                  radius={[8, 8, 0, 0]}
                  className="drop-shadow-sm"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Summary Stats */}
        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Months</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{data.length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


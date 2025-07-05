import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Transaction, DashboardSummary, CategoryExpense } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get total expenses
    const totalExpensesResult = await db
      .collection<Transaction>('transactions')
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
      .toArray();

    const totalExpenses = totalExpensesResult[0]?.total || 0;

    // Get category breakdown
    const categoryBreakdownResult = await db
      .collection<Transaction>('transactions')
      .aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' }
          }
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            total: { $round: ['$total', 2] },
            percentage: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$total', totalExpenses || 1] },
                    100
                  ]
                },
                1
              ]
            }
          }
        },
        {
          $sort: { total: -1 }
        }
      ])
      .toArray();

    const categoryBreakdown: CategoryExpense[] = categoryBreakdownResult.map(item => ({
      category: item.category,
      total: item.total,
      percentage: item.percentage
    }));

    // Get recent transactions (last 5)
    const recentTransactions = await db
      .collection<Transaction>('transactions')
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    // Get monthly expenses for the chart
    const monthlyExpensesResult = await db
      .collection<Transaction>('transactions')
      .aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            total: { $sum: '$amount' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: {
                    if: { $lt: ['$_id.month', 10] },
                    then: { $concat: ['0', { $toString: '$_id.month' }] },
                    else: { $toString: '$_id.month' }
                  }
                }
              ]
            },
            total: { $round: ['$total', 2] }
          }
        }
      ])
      .toArray();

    const dashboardSummary: DashboardSummary = {
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      categoryBreakdown,
      recentTransactions,
      monthlyExpenses: monthlyExpensesResult
    };

    return NextResponse.json(dashboardSummary);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Budget, Transaction, BudgetComparison } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required (format: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Get budgets for the specified month
    const budgets = await db
      .collection<Budget>('budgets')
      .find({ month })
      .toArray();

    if (budgets.length === 0) {
      return NextResponse.json([]);
    }

    // Get actual spending for each category in the specified month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const actualSpendingResult = await db
      .collection<Transaction>('transactions')
      .aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' }
          }
        }
      ])
      .toArray();

    // Create a map of actual spending by category
    const actualSpendingMap = new Map<string, number>();
    actualSpendingResult.forEach(item => {
      actualSpendingMap.set(item._id, item.total);
    });

    // Create budget comparison data
    const budgetComparisons: BudgetComparison[] = budgets.map(budget => {
      const actual = actualSpendingMap.get(budget.category) || 0;
      const percentage = budget.monthlyLimit > 0 ? (actual / budget.monthlyLimit) * 100 : 0;
      
      let status: 'under' | 'over' | 'on-track';
      if (percentage <= 90) {
        status = 'under';
      } else if (percentage > 100) {
        status = 'over';
      } else {
        status = 'on-track';
      }

      return {
        category: budget.category,
        budgeted: budget.monthlyLimit,
        actual: Math.round(actual * 100) / 100,
        percentage: Math.round(percentage * 10) / 10,
        status
      };
    });

    // Sort by category name
    budgetComparisons.sort((a, b) => a.category.localeCompare(b.category));

    return NextResponse.json(budgetComparisons);
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget comparison' },
      { status: 500 }
    );
  }
}


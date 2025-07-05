import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Transaction, MonthlyExpense } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Aggregate transactions by month
    const pipeline = [
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
    ];

    const monthlyExpenses = await db
      .collection<Transaction>('transactions')
      .aggregate<MonthlyExpense>(pipeline)
      .toArray();

    return NextResponse.json(monthlyExpenses);
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly expenses' },
      { status: 500 }
    );
  }
}


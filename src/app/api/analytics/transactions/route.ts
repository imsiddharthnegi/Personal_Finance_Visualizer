import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Transaction } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const transactions = await db
      .collection<Transaction>('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, date, description, category } = body;

    // Validation
    if (!amount || !date || !description) {
      return NextResponse.json(
        { error: 'Amount, date, and description are required' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const transaction: Omit<Transaction, '_id'> = {
      amount,
      date: new Date(date),
      description: description.trim(),
      category: category || 'Other',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Transaction>('transactions').insertOne(transaction);
    
    const newTransaction = await db
      .collection<Transaction>('transactions')
      .findOne({ _id: result.insertedId });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}


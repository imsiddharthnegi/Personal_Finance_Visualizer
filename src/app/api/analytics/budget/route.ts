import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Budget } from '@/types';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid budget ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { category, monthlyLimit, month } = body;

    // Validation
    if (!category || !monthlyLimit || !month) {
      return NextResponse.json(
        { error: 'Category, monthly limit, and month are required' },
        { status: 400 }
      );
    }

    if (typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
      return NextResponse.json(
        { error: 'Monthly limit must be a positive number' },
        { status: 400 }
      );
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if another budget exists for this category and month (excluding current budget)
    const existingBudget = await db
      .collection<Budget>('budgets')
      .findOne({ 
        category, 
        month, 
        _id: { $ne: new ObjectId(id) } 
      });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 409 }
      );
    }

    const updateData = {
      category: category.trim(),
      monthlyLimit,
      month,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Budget>('budgets')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    const updatedBudget = await db
      .collection<Budget>('budgets')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid budget ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db
      .collection<Budget>('budgets')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}


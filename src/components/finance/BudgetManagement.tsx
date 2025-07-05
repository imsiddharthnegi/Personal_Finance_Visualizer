'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Budget } from '@/types';
import { Edit, Trash2, Plus } from 'lucide-react';
import BudgetForm from './BudgetForm';

interface BudgetManagementProps {
  budgets: Budget[];
  currentMonth: string;
  onAdd: (budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (id: string, budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function BudgetManagement({
  budgets,
  currentMonth,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false
}: BudgetManagementProps) {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleAdd = async (budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await onAdd(budgetData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingBudget?._id) return;
    
    try {
      await onUpdate(editingBudget._id.toString(), budgetData);
      setIsEditDialogOpen(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Budget Management - {formatMonth(currentMonth)}</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Monthly Budget</DialogTitle>
                </DialogHeader>
                <BudgetForm
                  onSubmit={handleAdd}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No budgets set for {formatMonth(currentMonth)}. Set your first budget to start tracking!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Monthly Limit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => (
                    <TableRow key={budget._id?.toString()}>
                      <TableCell className="font-medium">
                        {budget.category}
                      </TableCell>
                      <TableCell>
                        {formatMonth(budget.month)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(budget.monthlyLimit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(budget._id?.toString() || '')}
                            disabled={isLoading || deletingId === budget._id?.toString()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm
              budget={editingBudget}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


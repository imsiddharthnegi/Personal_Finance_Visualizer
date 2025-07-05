'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PREDEFINED_CATEGORIES, Budget } from '@/types';

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function BudgetForm({
  budget,
  onSubmit,
  onCancel,
  isLoading = false
}: BudgetFormProps) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    monthlyLimit: budget?.monthlyLimit?.toString() || '',
    month: budget?.month || currentMonth
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.monthlyLimit.trim()) {
      newErrors.monthlyLimit = 'Monthly limit is required';
    } else if (isNaN(Number(formData.monthlyLimit)) || Number(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = 'Monthly limit must be a positive number';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        category: formData.category,
        monthlyLimit: Number(formData.monthlyLimit),
        month: formData.month
      });
    } catch (error) {
      console.error('Error submitting budget:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {budget ? 'Edit Budget' : 'Set Monthly Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={!!budget} // Disable category change when editing
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
            <Input
              id="monthlyLimit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.monthlyLimit}
              onChange={(e) => handleInputChange('monthlyLimit', e.target.value)}
              className={errors.monthlyLimit ? 'border-red-500' : ''}
            />
            {errors.monthlyLimit && (
              <p className="text-sm text-red-500">{errors.monthlyLimit}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className={errors.month ? 'border-red-500' : ''}
            />
            {errors.month && (
              <p className="text-sm text-red-500">{errors.month}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : (budget ? 'Update Budget' : 'Set Budget')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


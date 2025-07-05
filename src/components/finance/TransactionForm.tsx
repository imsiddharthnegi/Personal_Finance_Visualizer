'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types';
import { ObjectId } from 'mongodb';
import { Calendar, DollarSign, FileText, Tag, Loader2, CheckCircle } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
];

export default function TransactionForm({ transaction, onSubmit, onCancel, isLoading = false }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: transaction?.amount?.toString() || '',
    description: transaction?.description || '',
    category: transaction?.category || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: Number(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
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
    <div className="space-y-6 p-1">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Amount
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`form-input pl-8 ${errors.amount ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              disabled={isSubmitting}
            />
            <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Description
          </Label>
          <div className="relative">
            <Input
              id="description"
              type="text"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`form-input pl-8 ${errors.description ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              disabled={isSubmitting}
            />
            <FileText className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.description && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.description}
            </p>
          )}
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-600" />
            Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={`form-input ${errors.category ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="hover:bg-blue-50">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.category}
            </p>
          )}
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            Date
          </Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`form-input pl-8 ${errors.date ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              disabled={isSubmitting}
            />
            <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.date && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.date}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 btn-primary hover-lift font-semibold py-2.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {transaction ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {transaction ? 'Update Transaction' : 'Add Transaction'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 hover:bg-gray-50 border-2 font-semibold py-2.5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}


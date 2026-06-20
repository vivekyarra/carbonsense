/**
 * @file Form component for logging activities.
 */

/* eslint-disable react-hooks/incompatible-library */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CATEGORIES, SUBCATEGORIES } from '../../utils/constants';
import { calculateCO2 } from '../../utils/carbonCalculator';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

const activitySchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  quantity: z.number().positive('Quantity must be positive'),
  activity_date: z.string().min(1, 'Date is required'),
  notes: z.string().optional()
});

/**
 *
 * @param root0
 * @param root0.onSuccess
 */
export function ActivityForm({ onSuccess }) {
  const [co2Estimate, setCo2Estimate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      category: '',
      subcategory: '',
      quantity: '',
      activity_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const category = watch('category');
  const subcategory = watch('subcategory');
  const quantity = watch('quantity');

  // Optimistic calculation update
  React.useEffect(() => {
    if (category && subcategory && quantity > 0) {
      setCo2Estimate(calculateCO2(category, subcategory, parseFloat(quantity)));
    } else {
      setCo2Estimate(0);
    }
  }, [category, subcategory, quantity]);

  /**
   *
   * @param data
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Find unit
      const selectedSub = SUBCATEGORIES[data.category]?.find(s => s.id === data.subcategory);
      const payload = {
        ...data,
        unit: selectedSub ? selectedSub.unit : 'unit'
      };

      await api.post('/activities', payload);
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to log activity:', error);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subOptions = category ? SUBCATEGORIES[category] : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Log New Activity</h3>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          id="category"
          {...register('category')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
        <select
          id="subcategory"
          {...register('subcategory')}
          disabled={!category}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md disabled:bg-gray-100"
        >
          <option value="">Select an activity</option>
          {subOptions?.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>}
      </div>

      <Input
        label={`Quantity ${category && subcategory ? `(${SUBCATEGORIES[category]?.find(s => s.id === subcategory)?.unit})` : ''}`}
        id="quantity"
        type="number"
        step="any"
        {...register('quantity', { valueAsNumber: true })}
        error={errors.quantity?.message}
      />

      <Input
        label="Date"
        id="activity_date"
        type="date"
        {...register('activity_date')}
        error={errors.activity_date?.message}
      />

      <Input
        label="Notes (Optional)"
        id="notes"
        {...register('notes')}
        error={errors.notes?.message}
      />

      {co2Estimate > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <p className="text-sm text-green-800">
            Estimated Impact: <span className="font-bold text-lg">{co2Estimate} kg CO2e</span>
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging...' : 'Log Activity'}
      </Button>
    </form>
  );
}

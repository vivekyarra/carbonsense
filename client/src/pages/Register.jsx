/**
 * @file Register page.
 */

import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Leaf } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80, 'Name must not exceed 80 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Use uppercase, lowercase, and a number'),
  daily_target_kg: z.number().positive('Target must be positive').optional().default(10)
});

/**
 * @description Registration page for new users.
 */
export default function Register() {
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      daily_target_kg: 10
    }
  });

  if (user) {
    return <Navigate to="/" />;
  }

  /**
   * @description Submits validated registration data.
   * @param {object} data - Registration form data.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Leaf className="w-12 h-12 text-green-700" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-green-700 underline-offset-2 hover:underline">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Name"
              id="name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
              autoComplete="name"
            />

            <Input
              label="Email address"
              id="email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
              inputMode="email"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <Input
              label="Daily Target (kg CO2e)"
              id="daily_target_kg"
              type="number"
              step="0.1"
              {...register('daily_target_kg', { valueAsNumber: true })}
              error={errors.daily_target_kg?.message}
              min="0.1"
            />

            {authError && (
              <div className="rounded-md bg-red-50 p-4" role="alert" aria-live="assertive">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{authError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

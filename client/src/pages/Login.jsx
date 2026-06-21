/**
 * @file Login page.
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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

/**
 * @description Authentication page for existing users.
 */
export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  if (user) {
    return <Navigate to="/" />;
  }

  /**
   * @description Submits validated credentials.
   * @param {{email: string, password: string}} data - Login form data.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          Sign in to CarbonSense
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-green-700 underline-offset-2 hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              autoComplete="current-password"
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
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

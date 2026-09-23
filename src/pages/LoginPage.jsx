import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import authService from '../services/authService';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 items-center justify-center text-indigo-700 mb-3">
            <LogIn className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Sign in to access your personal accessibility assistant
          </p>
        </div>

        {/* Error notification banner */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="text-xs text-rose-800 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Accessible Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2"
            ariaLabel="Sign in to your AccessAI account"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Link to Register */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-base text-slate-600">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 rounded px-1"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

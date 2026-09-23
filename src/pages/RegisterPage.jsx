import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import authService from '../services/authService';

export default function RegisterPage() {
  useDocumentTitle('Create Account');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <UserPlus className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Get personalized accessibility assistance across all your devices
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
              <p className="font-semibold">Registration Issue</p>
              <p className="text-xs text-rose-800 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Accessible Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="register-name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <Input
            id="register-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <Input
            id="register-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            helperText="Minimum 8 characters with letters and numbers"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-4"
            ariaLabel="Register for AccessAI"
          >
            {isLoading ? 'Creating Account...' : 'Create Free Account'}
          </Button>
        </form>

        {/* Link to Login */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-base text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 rounded px-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

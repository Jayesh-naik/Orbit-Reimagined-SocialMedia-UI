import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ name, email, password }) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signUp(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800"
      >
        <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Create your account</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Start organizing your team on FlowBoard AI</p>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-700 dark:border-slate-600"
              placeholder="Jayesh Sharma"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-700 dark:border-slate-600"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-700 dark:border-slate-600"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

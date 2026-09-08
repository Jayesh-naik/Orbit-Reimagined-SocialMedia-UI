import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../services/mockStorage';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (email) => {
    setSubmitting(true);
    try {
      await login(email, 'password123');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-[#0b0f19] to-indigo-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-[#1e2942] bg-[#0c101d] p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FlowBoard AI</h1>
            <p className="text-xs text-slate-400">Collaborative Project Intelligence</p>
          </div>
        </div>

        <h2 className="mb-1 text-lg font-bold text-white">Welcome back</h2>
        <p className="mb-6 text-xs text-slate-400">Sign in to your team workspace</p>

        {/* 1-Click Demo Persona Login Section */}
        <div className="mb-6 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5" />
            1-Click Demo Login Personas
          </span>
          <div className="grid grid-cols-1 gap-2">
            {MOCK_USERS.slice(0, 3).map((u) => (
              <button
                key={u._id}
                type="button"
                onClick={() => handleQuickDemoLogin(u.email)}
                className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-[#12182b] px-3.5 py-2 text-xs text-slate-200 hover:border-brand-500 hover:bg-[#18213b] transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <img src={u.avatar} alt={u.name} className="h-6 w-6 rounded-full object-cover" />
                  <div>
                    <span className="font-bold block">{u.name}</span>
                    <span className="text-[10px] text-slate-400">{u.bio}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-brand-400">Login →</span>
              </button>
            ))}
          </div>
        </div>

        {serverError && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs text-red-400">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-xl border border-slate-700 bg-[#080c17] px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500"
              placeholder="jayesh@flowboard.ai"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full rounded-xl border border-slate-700 bg-[#080c17] px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 py-2.5 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60 shadow-lg shadow-brand-500/25"
          >
            {submitting ? 'Signing in…' : 'Sign in to Workspace'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-400 hover:underline">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

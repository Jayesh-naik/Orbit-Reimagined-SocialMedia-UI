import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Check, ShieldAlert, Moon, Sun, Bell, Key } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  const [theme, setTheme] = useState(user?.theme || localStorage.getItem('theme') || 'dark');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [taskAssigned, setTaskAssigned] = useState(user?.notificationPreferences?.taskAssigned ?? true);
  const [commentAdded, setCommentAdded] = useState(user?.notificationPreferences?.commentAdded ?? true);
  const [projectInvite, setProjectInvite] = useState(user?.notificationPreferences?.projectInvite ?? true);
  const [taskCompleted, setTaskCompleted] = useState(user?.notificationPreferences?.taskCompleted ?? true);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState('');

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      await api.put('/auth/settings', { theme: newTheme });
    } catch (err) {
      console.error('Failed to sync theme:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifSuccess('');

    try {
      await api.put('/auth/settings', {
        notificationPreferences: {
          taskAssigned,
          commentAdded,
          projectInvite,
          taskCompleted,
        },
      });
      setNotifSuccess('Notification preferences updated successfully');
      setTimeout(() => setNotifSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Settings</h1>
        <p className="text-sm text-slate-505 dark:text-slate-400">Configure application theme, security credentials, and notifications</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Theme Picker */}
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm h-fit">
          <h3 className="mb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-amber-500" /> App Theme
          </h3>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-[#12182b]/30 ${
                theme === 'light'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/10 dark:text-brand-400'
                  : 'border-slate-200 text-slate-500 dark:border-[#1e2942]/60 dark:text-slate-400'
              }`}
            >
              <Sun className="h-4 w-4" /> Light Mode
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-[#12182b]/30 ${
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/10 dark:text-brand-400'
                  : 'border-slate-200 text-slate-500 dark:border-[#1e2942]/60 dark:text-slate-400'
              }`}
            >
              <Moon className="h-4 w-4" /> Dark Mode
            </button>
          </div>
        </div>

        {/* Right Column: Alerts & Updates */}
        <div className="space-y-6 md:col-span-2">
          {/* Notification Preferences */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-brand-500" /> Notification Preferences
            </h3>
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="space-y-3.5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskAssigned}
                    onChange={(e) => setTaskAssigned(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-200 dark:border-[#1e2942]/60 bg-slate-50 dark:bg-[#0d1326] text-brand-600 focus:ring-brand-550 focus:ring-offset-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">Task Assignments</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      Receive a notification when a teammate assigns a task to you
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commentAdded}
                    onChange={(e) => setCommentAdded(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-200 dark:border-[#1e2942]/60 bg-slate-50 dark:bg-[#0d1326] text-brand-600 focus:ring-brand-550 focus:ring-offset-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">Comments Added</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      Receive a notification when someone comments on your tasks or reports
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectInvite}
                    onChange={(e) => setProjectInvite(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-200 dark:border-[#1e2942]/60 bg-slate-50 dark:bg-[#0d1326] text-brand-600 focus:ring-brand-550 focus:ring-offset-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">Project Invites</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      Receive a notification when someone adds you to a team project
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskCompleted}
                    onChange={(e) => setTaskCompleted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-200 dark:border-[#1e2942]/60 bg-slate-50 dark:bg-[#0d1326] text-brand-600 focus:ring-brand-550 focus:ring-offset-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">Task Completion</span>
                    <span className="block text-[10px] text-slate-555 font-semibold mt-0.5">
                      Receive a notification when tasks you reported or are assigned to are completed
                    </span>
                  </div>
                </label>
              </div>

              {notifSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400 animate-in fade-in">
                  <Check className="h-4 w-4" /> {notifSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={notifLoading}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50"
              >
                {notifLoading ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-brand-550" /> Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                  />
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400 animate-in fade-in">
                  <Check className="h-4 w-4" /> {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs font-semibold text-red-400 animate-in fade-in">
                  <ShieldAlert className="h-4 w-4" /> {passwordError}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50"
              >
                {passwordLoading ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

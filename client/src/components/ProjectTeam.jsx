import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, Trash2, Shield, User, Eye, MoreHorizontal, Plus } from 'lucide-react';

const roleColors = {
  owner: 'bg-indigo-500/10 text-indigo-400 border border-indigo-550/20',
  admin: 'bg-blue-500/10 text-blue-400 border border-blue-550/20',
  member: 'bg-amber-500/10 text-amber-400 border border-amber-550/20',
  viewer: 'bg-slate-500/10 text-slate-400 border border-slate-550/20',
};

const ProjectTeam = ({ project, tasks = [], yourRole, onUpdateProject }) => {
  const { user: currentUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canManage = yourRole === 'owner' || yourRole === 'admin';

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post(`/projects/${project._id}/members`, {
        email: email.trim(),
        role,
      });
      setSuccess('Teammate invited successfully!');
      setEmail('');
      setRole('member');
      if (onUpdateProject) {
        onUpdateProject(data.project);
      }
      setTimeout(() => {
        setSuccess('');
        setShowInviteModal(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      const { data } = await api.delete(`/projects/${project._id}/members/${userId}`);
      if (onUpdateProject) {
        onUpdateProject(data.project);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  // Status mapping logic helper
  const getStatusInfo = (memberId) => {
    const currentId = currentUser?.id || currentUser?._id;
    if (memberId?.toString() === currentId?.toString()) {
      return { text: 'Online', color: 'bg-emerald-500', textClass: 'text-emerald-400' };
    }
    const states = [
      { text: 'Online', color: 'bg-emerald-500', textClass: 'text-emerald-400' },
      { text: 'Away', color: 'bg-amber-500', textClass: 'text-amber-400' },
      { text: 'Offline', color: 'bg-slate-500', textClass: 'text-slate-500' },
    ];
    // Deterministic selection based on ID hash
    const idx = memberId ? memberId.charCodeAt(memberId.length - 1) % 3 : 0;
    return states[idx];
  };

  // Stats calculator for active vs done tasks
  const getMemberTaskStats = (memberId) => {
    const memberTasks = tasks.filter((t) => t.assignedTo?.some((u) => u._id === memberId));
    const completedCol = project.columns[project.columns.length - 1];
    
    const done = memberTasks.filter((t) => t.status === completedCol).length;
    const active = memberTasks.length - done;

    return { active, done };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Invite action button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Team</h2>
          <p className="text-xs text-slate-500">
            {project.name} • {project.members?.length || 1} members
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-550/20 hover:bg-brand-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* 2. Members Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {project.members?.map((m) => {
          const isOwner = project.owner?._id?.toString() === m.user?._id?.toString();
          const actualRole = isOwner ? 'owner' : m.role;
          const statusInfo = getStatusInfo(m.user?._id);
          const taskStats = getMemberTaskStats(m.user?._id);

          return (
            <div
              key={m.user?._id}
              className="relative flex flex-col justify-between rounded-2xl border border-[#1e2942]/60 bg-[#12182b]/40 p-5 shadow-sm hover:brightness-110 transition"
            >
              {/* Top Card Section: Avatar & Info & Kebab */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="relative">
                    {m.user?.avatar ? (
                      <img
                        src={m.user.avatar}
                        alt={m.user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/10 text-sm font-bold text-brand-400 border border-brand-550/20">
                        {m.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    {/* Status dot */}
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#090d16] ${statusInfo.color}`} />
                  </div>

                  {/* Context Kebab/Remove */}
                  <div className="flex items-center gap-1">
                    {canManage && !isOwner && m.user?._id !== currentUser?.id && m.user?._id !== currentUser?._id && (
                      <button
                        onClick={() => handleRemoveMember(m.user?._id)}
                        title="Remove member"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-950/20 hover:text-red-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button className="rounded-lg p-1.5 text-slate-500 hover:bg-[#1c243a] hover:text-slate-300">
                      <MoreHorizontal className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate max-w-[130px]">{m.user?.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                      roleColors[actualRole] || roleColors.member
                    }`}>
                      {actualRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{m.user?.email}</p>
                </div>
              </div>

              {/* Bottom Card Section: Stats & Status label */}
              <div className="mt-6 flex items-center justify-between border-t border-[#1e2942]/30 pt-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  <span className="text-white font-bold">{taskStats.active}</span> active{' '}
                  <span className="text-white font-bold">{taskStats.done}</span> done
                </span>
                <span className={`text-[10px] font-bold ${statusInfo.textClass}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          );
        })}

        {/* 3. Dotted Invite Teammate trigger Card */}
        {canManage && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1e2942]/60 hover:border-brand-500/50 hover:bg-[#12182b]/10 transition group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/40 text-slate-400 group-hover:bg-brand-600/10 group-hover:text-brand-400 transition mb-2">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-brand-400 transition">
              Invite a teammate
            </span>
          </button>
        )}
      </div>

      {/* 4. Invite Dialog Modal overlay */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e2942] bg-[#090d16] p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-brand-400" /> Invite Teammate
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Project Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-3.5 py-2.5 text-sm text-slate-200 outline-none focus:border-brand-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              {success && (
                <div className="rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
                  {success}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-[#12182b] hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Invite Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTeam;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Check, Upload, Tag, X, User as UserIcon } from 'lucide-react';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper',
];

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setCustomAvatarUrl('');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;
    if (skills.includes(cleanSkill)) {
      setNewSkill('');
      return;
    }
    setSkills([...skills, cleanSkill]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    try {
      await api.put('/auth/profile', {
        name,
        bio,
        skills,
        avatar: finalAvatar,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Profile Settings</h1>
        <p className="text-sm text-slate-400">Customize your public presence and professional skill set</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Column: Avatar Management */}
          <div className="rounded-2xl border border-[#1e2942]/60 bg-[#12182b]/40 p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Avatar Image</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="group relative h-28 w-28 overflow-hidden rounded-full border border-[#1e2942]/60 bg-[#0d1326]">
                {avatar || customAvatarUrl ? (
                  <img
                    src={customAvatarUrl || avatar}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <UserIcon className="h-12 w-12" />
                  </div>
                )}
                <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-5 w-5 text-white" />
                  <span className="text-[10px] font-medium text-white mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <span className="text-[10px] text-slate-500 text-center font-semibold">
                Click preview to upload (Max 2MB)
              </span>

              <div className="w-full">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Preset Options:</span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AVATARS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        setAvatar(url);
                        setCustomAvatarUrl('');
                      }}
                      className={`aspect-square overflow-hidden rounded-lg border-2 p-0.5 transition hover:scale-105 ${
                        avatar === url
                          ? 'border-brand-500 bg-brand-900/10'
                          : 'border-[#1e2942]/60'
                      }`}
                    >
                      <img src={url} alt="Preset Avatar" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full pt-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Or Custom Image URL:
                </label>
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    setAvatar('');
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details & Skills */}
          <div className="space-y-6 md:col-span-2">
            {/* Details */}
            <div className="rounded-2xl border border-[#1e2942]/60 bg-[#12182b]/40 p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-400">Bio</label>
                    <span className="text-[10px] text-slate-500 font-semibold">{bio.length}/300</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 300))}
                    placeholder="Write a short summary about yourself..."
                    rows={4}
                    className="w-full rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-[#1e2942]/60 bg-[#12182b]/40 p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-4 w-4" /> Skills & Expertise
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. React, Python)"
                    className="flex-1 rounded-xl border border-[#1e2942]/60 bg-[#0d1326] px-4 py-2 text-sm text-slate-200 outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
                  >
                    Add
                  </button>
                </div>

                {skills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No skills listed yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 rounded-full bg-[#1c243a] px-3 py-1 text-xs font-semibold text-slate-350 border border-[#1e2942]/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-500 hover:text-red-400 focus:outline-none transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Alerts */}
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
                <Check className="h-5 w-5" />
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setName(user?.name || '');
                  setBio(user?.bio || '');
                  setSkills(user?.skills || []);
                  setAvatar(user?.avatar || '');
                }}
                className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-[#12182b] hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;

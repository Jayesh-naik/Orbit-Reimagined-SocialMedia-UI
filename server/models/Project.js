const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    // Columns define the Kanban board structure for this project
    columns: {
      type: [String],
      default: ['Backlog', 'Todo', 'In Progress', 'Testing', 'Completed'],
    },
    status: { type: String, enum: ['active', 'archived', 'completed'], default: 'active' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    deadline: { type: Date },
  },
  { timestamps: true }
);

// Helper to check a user's role on this project
projectSchema.methods.getRole = function (userId) {
  const ownerId = this.owner?._id ? this.owner._id.toString() : this.owner?.toString();
  if (ownerId === userId.toString()) return 'owner';
  const m = this.members.find((member) => {
    const memberUserId = member.user?._id ? member.user._id.toString() : member.user?.toString();
    return memberUserId === userId.toString();
  });
  return m ? m.role : null;
};

module.exports = mongoose.model('Project', projectSchema);

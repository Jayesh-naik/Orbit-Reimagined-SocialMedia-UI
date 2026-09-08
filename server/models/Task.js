const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String }, // e.g. "moved task to In Progress"
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, default: 'Backlog' }, // must match one of project.columns
    priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'], default: 'medium' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labels: [{ type: String }],
    dueDate: { type: Date },
    attachments: [
      {
        url: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    checklist: [
      {
        text: String,
        done: { type: Boolean, default: false },
      },
    ],
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    order: { type: Number, default: 0 }, // for drag-and-drop ordering within a column
    activityLog: [activityLogSchema],
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, status: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);

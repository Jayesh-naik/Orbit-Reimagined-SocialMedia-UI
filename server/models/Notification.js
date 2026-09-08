const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['task_assigned', 'comment_added', 'deadline_reminder', 'member_joined', 'task_completed', 'project_invite'],
      required: true,
    },
    message: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

// FlowBoard-AI Client-Side Data Service & Mock Storage
// Ensures 100% frontend-only functionality with local storage persistence.

const STORAGE_KEYS = {
  USER: 'flowboard_current_user',
  TOKEN: 'accessToken',
  PROJECTS: 'flowboard_mock_projects',
  TASKS: 'flowboard_mock_tasks',
  COMMENTS: 'flowboard_mock_comments',
  NOTIFICATIONS: 'flowboard_mock_notifications',
};

// Seed Mock Data
export const MOCK_USERS = [
  {
    _id: 'user-1',
    id: 'user-1',
    name: 'Jayesh (Demo Lead)',
    email: 'jayesh@flowboard.ai',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Full-Stack Architect & AI Product Designer',
    skills: ['React', 'Node.js', 'System Architecture', 'AI Engineering'],
  },
  {
    _id: 'user-2',
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@flowboard.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Product Manager',
    skills: ['Agile', 'Roadmapping', 'Scrum Master', 'User Research'],
  },
  {
    _id: 'user-3',
    id: 'user-3',
    name: 'Alex Rivera',
    email: 'alex@flowboard.ai',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Developer & UI Specialist',
    skills: ['TypeScript', 'TailwindCSS', 'Framer Motion', 'React'],
  },
  {
    _id: 'user-4',
    id: 'user-4',
    name: 'Marcus Vance',
    email: 'marcus@flowboard.ai',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Cloud Infrastructure & DevOps Engineer',
    skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD'],
  },
  {
    _id: 'user-5',
    id: 'user-5',
    name: 'Elena Rostova',
    email: 'elena@flowboard.ai',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead UX Designer',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'Micro-interactions'],
  },
];

const INITIAL_PROJECTS = [
  {
    _id: 'proj-1',
    name: 'FlowBoard AI Platform (v2.0)',
    description: 'Next-gen collaborative project workspace with real-time Socket.io sync, automated AI task breakdowns & burndown analytics.',
    columns: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'],
    status: 'active',
    priority: 'high',
    deadline: '2026-10-15',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    owner: 'user-1',
    members: [
      { user: MOCK_USERS[0], role: 'owner' },
      { user: MOCK_USERS[1], role: 'admin' },
      { user: MOCK_USERS[2], role: 'member' },
      { user: MOCK_USERS[3], role: 'member' },
      { user: MOCK_USERS[4], role: 'viewer' },
    ],
  },
  {
    _id: 'proj-2',
    name: 'Mobile Banking App Refresh',
    description: 'iOS & Android cross-platform refresh using React Native, glassmorphism design tokens, and bio-metric security.',
    columns: ['Backlog', 'Todo', 'In Progress', 'Done'],
    status: 'active',
    priority: 'urgent',
    deadline: '2026-09-30',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    owner: 'user-1',
    members: [
      { user: MOCK_USERS[0], role: 'owner' },
      { user: MOCK_USERS[4], role: 'admin' },
      { user: MOCK_USERS[2], role: 'member' },
    ],
  },
  {
    _id: 'proj-3',
    name: 'Cloud Infrastructure Migration',
    description: 'Transitioning legacy monolith database clusters to Kubernetes pods & AWS Lambda serverless endpoints.',
    columns: ['Backlog', 'Todo', 'In Progress', 'Done'],
    status: 'active',
    priority: 'medium',
    deadline: '2026-11-20',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    owner: 'user-1',
    members: [
      { user: MOCK_USERS[0], role: 'owner' },
      { user: MOCK_USERS[3], role: 'admin' },
    ],
  },
];

const INITIAL_TASKS = [
  // Proj 1 Tasks
  {
    _id: 'task-101',
    project: 'proj-1',
    title: 'Implement Socket.io Real-Time Kanban Sync',
    description: 'Set up room listeners for taskCreated, taskMoved, and taskUpdated events to enable live collaboration across multiple open tabs.',
    status: 'Done',
    priority: 'urgent',
    assignedTo: [MOCK_USERS[0], MOCK_USERS[2]],
    labels: ['realtime', 'sockets', 'core'],
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'ck-1', text: 'Configure Express Socket.io server', done: true },
      { id: 'ck-2', text: 'Implement optimistic client updates', done: true },
      { id: 'ck-3', text: 'Add disconnect reconnection handler', done: true },
    ],
    estimatedHours: 12,
    actualHours: 10,
    attachments: [{ name: 'architecture_diagram.png', url: '#' }],
    activityLog: [{ action: 'Moved to Done', user: 'Jayesh (Demo Lead)', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }],
  },
  {
    _id: 'task-102',
    project: 'proj-1',
    title: 'AI Smart Risk Detection & Workload Balancer',
    description: 'Integrate automated heuristic analysis to detect team burnout, approaching deadline bottlenecks, and unassigned urgent bugs.',
    status: 'In Progress',
    priority: 'urgent',
    assignedTo: [MOCK_USERS[0]],
    labels: ['ai-feature', 'analytics', 'high-value'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'ck-4', text: 'Define risk scoring algorithm', done: true },
      { id: 'ck-5', text: 'Build AI Insights Modal UI', done: true },
      { id: 'ck-6', text: '1-click automated re-assignment actions', done: false },
    ],
    estimatedHours: 16,
    actualHours: 8,
    attachments: [],
    activityLog: [{ action: 'Moved to In Progress', user: 'Jayesh (Demo Lead)', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }],
  },
  {
    _id: 'task-103',
    project: 'proj-1',
    title: 'Sprint Burndown & Velocity Recharts Dashboard',
    description: 'Render dynamic SVG charts displaying total story points, scope creep line, and team completion trends.',
    status: 'In Review',
    priority: 'high',
    assignedTo: [MOCK_USERS[2], MOCK_USERS[1]],
    labels: ['charts', 'recharts', 'analytics'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'ck-7', text: 'Compute ideal vs actual burndown points', done: true },
      { id: 'ck-8', text: 'Add tooltips and custom HSL color tokens', done: true },
    ],
    estimatedHours: 8,
    actualHours: 6,
    attachments: [],
    activityLog: [],
  },
  {
    _id: 'task-104',
    project: 'proj-1',
    title: 'Design System Polish: Glassmorphism & Micro-animations',
    description: 'Apply slate/indigo dark theme palette (#0b0f19), smooth hover transitions, glow focus rings, and custom scrollbar styling.',
    status: 'Todo',
    priority: 'medium',
    assignedTo: [MOCK_USERS[4]],
    labels: ['ui-ux', 'design-tokens', 'framer-motion'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'ck-9', text: 'Audit mobile drawer navigation', done: false },
      { id: 'ck-10', text: 'Add keyboard shortcut command palette (⌘K)', done: true },
    ],
    estimatedHours: 10,
    actualHours: 0,
    attachments: [],
    activityLog: [],
  },
  {
    _id: 'task-105',
    project: 'proj-1',
    title: 'JWT Refresh Cookie & Role-Based Guard Middleware',
    description: 'Enforce owner | admin | member | viewer permissions across task mutations and project settings.',
    status: 'Backlog',
    priority: 'low',
    assignedTo: [MOCK_USERS[3]],
    labels: ['security', 'auth', 'backend'],
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [],
    estimatedHours: 14,
    actualHours: 0,
    attachments: [],
    activityLog: [],
  },
  // Proj 2 Tasks
  {
    _id: 'task-201',
    project: 'proj-2',
    title: 'Biometric FaceID Login Integration',
    description: 'Implement secure local key storage and FaceID prompt trigger for iOS/Android builds.',
    status: 'In Progress',
    priority: 'urgent',
    assignedTo: [MOCK_USERS[0], MOCK_USERS[2]],
    labels: ['mobile', 'security'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'ck-20', text: 'Configure Native Modules', done: true },
      { id: 'ck-21', text: 'Add fallback passcode screen', done: false },
    ],
    estimatedHours: 10,
    actualHours: 4,
  },
  {
    _id: 'task-202',
    project: 'proj-2',
    title: 'Dark Mode Account Overview Wireframe',
    description: 'Create high-fidelity Figma components for recent transaction list and balance card carousel.',
    status: 'Done',
    priority: 'high',
    assignedTo: [MOCK_USERS[4]],
    labels: ['figma', 'design'],
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [],
    estimatedHours: 6,
    actualHours: 6,
  },
];

const INITIAL_COMMENTS = [
  {
    _id: 'cmt-1',
    task: 'task-101',
    user: MOCK_USERS[1],
    message: 'Awesome work on the Socket.io room handling! Testing across two browser windows worked instantly.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'cmt-2',
    task: 'task-102',
    user: MOCK_USERS[2],
    message: 'I can help take on the automated re-assignment feature once burndown charts are finished!',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    receiver: 'user-1',
    sender: MOCK_USERS[1],
    message: 'Sarah Chen tagged you in task #102: "AI Smart Risk Detection"',
    project: 'proj-1',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-2',
    receiver: 'user-1',
    sender: MOCK_USERS[2],
    message: 'Alex Rivera completed checklist item in #103: Sprint Burndown',
    project: 'proj-1',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-3',
    receiver: 'user-1',
    sender: MOCK_USERS[3],
    message: 'Marcus Vance moved "Biometric FaceID Login" to In Progress',
    project: 'proj-2',
    read: true,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
];

class MockStorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USERS[0]));
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'demo_access_token_jayesh');
    }
  }

  // --- Auth API ---
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : MOCK_USERS[0];
  }

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, `token_${user._id}`);
  }

  login(email) {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || MOCK_USERS[0];
    this.setCurrentUser(found);
    return { user: found, accessToken: `token_${found._id}` };
  }

  register(name, email) {
    const newUser = {
      _id: `user-${Date.now()}`,
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'FlowBoard AI Workspace Contributor',
      skills: ['Frontend', 'Collaboration'],
    };
    this.setCurrentUser(newUser);
    return { user: newUser, accessToken: `token_${newUser._id}` };
  }

  // --- Projects API ---
  getProjects() {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
  }

  getProjectById(id) {
    const projects = this.getProjects();
    const project = projects.find((p) => p._id === id) || projects[0];
    const tasks = this.getTasksForProject(project._id);
    return {
      project,
      tasks,
      yourRole: project.owner === this.getCurrentUser()._id ? 'owner' : 'admin',
    };
  }

  createProject({ name, description, priority = 'medium', deadline }) {
    const projects = this.getProjects();
    const newProj = {
      _id: `proj-${Date.now()}`,
      name,
      description: description || 'New collaborative board workspace.',
      columns: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'],
      status: 'active',
      priority,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      owner: this.getCurrentUser()._id,
      members: [
        { user: this.getCurrentUser(), role: 'owner' },
        { user: MOCK_USERS[1], role: 'admin' },
        { user: MOCK_USERS[2], role: 'member' },
      ],
    };
    projects.unshift(newProj);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProj;
  }

  updateProject(id, updates) {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p._id === id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return projects[idx];
    }
    return null;
  }

  // --- Tasks API ---
  getTasks() {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  }

  getTasksForProject(projectId) {
    const tasks = this.getTasks();
    return tasks.filter((t) => t.project === projectId);
  }

  createTask(taskData) {
    const tasks = this.getTasks();
    const newTask = {
      _id: `task-${Date.now()}`,
      project: taskData.project || taskData.projectId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Todo',
      priority: taskData.priority || 'medium',
      assignedTo: taskData.assignedTo || [this.getCurrentUser()],
      labels: taskData.labels || ['general'],
      dueDate: taskData.dueDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      checklist: taskData.checklist || [],
      estimatedHours: taskData.estimatedHours || 4,
      actualHours: 0,
      attachments: [],
      activityLog: [
        {
          action: 'Task Created',
          user: this.getCurrentUser().name,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  }

  moveTask(taskId, newStatus) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t._id === taskId);
    if (idx !== -1) {
      tasks[idx].status = newStatus;
      if (!tasks[idx].activityLog) tasks[idx].activityLog = [];
      tasks[idx].activityLog.push({
        action: `Moved to ${newStatus}`,
        user: this.getCurrentUser().name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return tasks[idx];
    }
    return null;
  }

  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t._id === taskId);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return tasks[idx];
    }
    return null;
  }

  deleteTask(taskId) {
    let tasks = this.getTasks();
    tasks = tasks.filter((t) => t._id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return { success: true };
  }

  // --- Comments API ---
  getComments(taskId) {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const comments = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    return comments.filter((c) => c.task === taskId);
  }

  addComment(taskId, message) {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const comments = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    const newComment = {
      _id: `cmt-${Date.now()}`,
      task: taskId,
      user: this.getCurrentUser(),
      message,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    return newComment;
  }

  // --- Notifications API ---
  getNotifications() {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const unreadCount = notifs.filter((n) => !n.read).length;
    return { notifications: notifs, unreadCount };
  }

  markNotificationRead(id) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const idx = notifs.findIndex((n) => n._id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
    return { success: true };
  }

  markAllNotificationsRead() {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    notifs.forEach((n) => (n.read = true));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return { success: true };
  }

  // --- AI Generator Helper ---
  generateAiTasks(projectId, promptText) {
    const text = promptText.toLowerCase();
    let generated = [];

    if (text.includes('auth') || text.includes('login') || text.includes('security')) {
      generated = [
        {
          title: 'Implement OAuth 2.0 & Multi-Factor Auth (MFA)',
          description: 'Add Google & GitHub OAuth login providers with QR-code TOTP two-factor verification.',
          priority: 'urgent',
          labels: ['ai-generated', 'security', 'auth'],
          estimatedHours: 8,
          status: 'Todo',
        },
        {
          title: 'Audit Password Hashing & Rate Limiting',
          description: 'Use Argon2/Bcrypt with cost factor 12 and Redis sliding window rate-limiting for login endpoints.',
          priority: 'high',
          labels: ['security', 'ai-suggested'],
          estimatedHours: 4,
          status: 'Backlog',
        },
      ];
    } else if (text.includes('design') || text.includes('ui') || text.includes('mobile')) {
      generated = [
        {
          title: 'Build Dark Mode Theme Provider & Token Switcher',
          description: 'Export design tokens from Tailwind config and support smooth CSS variable color transitions.',
          priority: 'high',
          labels: ['ui-ux', 'ai-generated'],
          estimatedHours: 6,
          status: 'Todo',
        },
        {
          title: 'Mobile Swipe Gestures for Kanban Columns',
          description: 'Support horizontal touch swipe navigation across board stages on iOS & Android viewports.',
          priority: 'medium',
          labels: ['mobile', 'ux'],
          estimatedHours: 5,
          status: 'Backlog',
        },
      ];
    } else {
      generated = [
        {
          title: `AI Action: ${promptText.slice(0, 45)}...`,
          description: `Automatically created task breakdown for project scope requirement: "${promptText}"`,
          priority: 'high',
          labels: ['ai-generated', 'feature'],
          estimatedHours: 6,
          status: 'Todo',
        },
        {
          title: `Integration & QA Verification for ${promptText.slice(0, 30)}`,
          description: 'Automated test suite creation and acceptance criteria validation.',
          priority: 'medium',
          labels: ['qa', 'ai-suggested'],
          estimatedHours: 4,
          status: 'Backlog',
        },
      ];
    }

    const createdTasks = generated.map((gt) =>
      this.createTask({
        ...gt,
        project: projectId,
        assignedTo: [MOCK_USERS[0], MOCK_USERS[2]],
      })
    );

    return createdTasks;
  }
}

export const mockStorage = new MockStorageService();

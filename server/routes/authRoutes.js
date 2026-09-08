const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateSettings,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/settings', protect, updateSettings);

module.exports = router;

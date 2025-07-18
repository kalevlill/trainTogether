const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

console.log('user.js routes loaded');

// Test route
router.get('/test', (req, res) => res.send('User routes working'));

// Onboarding route
router.post('/onboarding', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  console.log('Onboarding route hit');
  try {
    const { location, level, sports, gender, birthday } = req.body;
    const profilePicture = req.file;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        location,
        level,
        sports: JSON.parse(sports),
        gender,
        birthday: birthday ? new Date(birthday) : null,
        profilePicturePath: profilePicture?.path || null,
      },
    });

    res.json({ message: 'Onboarding data saved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        firstName: true,
        lastName: true,
        location: true,
        sports: true,
        level: true,
        profilePicturePath: true,
        onboardingComplete: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const { firstName, lastName, location, level, sports } = req.body;
    const profilePicture = req.file;

    const updateData = {
      firstName,
      lastName,
      location,
      level,
      sports: sports ? JSON.parse(sports) : undefined,
    };

    if (profilePicture) {
      updateData.profilePicturePath = profilePicture.path;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
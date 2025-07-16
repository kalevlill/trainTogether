const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

console.log('user.js routes loaded');
router.get('/test', (req, res) => res.send('User routes working'));
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

module.exports = router;
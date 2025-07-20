const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

console.log("user.js routes loaded");

// Test route
router.get("/test", (req, res) => res.send("User routes working"));

// Onboarding route
router.post("/onboarding", authMiddleware, upload.any(), async (req, res) => {
  console.log("Onboarding route hit");
  try {
    const { location, level, sports, gender, birthday } = req.body;
    const profilePicture = req.files?.find(
      (file) => file.fieldname === "profilePicture"
    );
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
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

    res.json({ message: "Onboarding data saved." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
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
        birthday: true,
        gender: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// Update user profile
router.put("/profile", authMiddleware, upload.any(), async (req, res) => {
  console.log("Incoming form data:", req.body);
  console.log("Incoming files:", req.files);
  try {
    const {
      firstName,
      lastName,
      location,
      level,
      sports,
      birthday,
      gender,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const profilePicture = req.files?.find(
      (file) => file.fieldname === "profilePicture"
    );

    const updateData = {
      firstName,
      lastName,
      location,
      level,
      gender,
      email,
    };

    if (birthday) {
      updateData.birthday = new Date(birthday);
    }

    if (sports) {
      updateData.sports = JSON.parse(sports);
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res
          .status(400)
          .json({ error: "All password fields are required." });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: "Current password is incorrect." });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

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
    res.status(500).json({ error: "Failed to update profile." });
  }
});

module.exports = router;

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");
const uploadToS3 = require("../utils/S3Uploader");

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

    const updateData = {
      location,
      level,
      sports: JSON.parse(sports),
      gender,
      birthday: birthday ? new Date(birthday) : null,
    };

    if (profilePicture) {
      try {
        console.log("Uploading onboarding profile picture to S3:", profilePicture.originalname);
        const s3Response = await uploadToS3(profilePicture);
        console.log("S3 upload successful:", s3Response.Location);
        updateData.profilePicturePath = s3Response.Location;

        // delete local file after upload
        fs.unlinkSync(profilePicture.path);
      } catch (err) {
        console.error("S3 upload failed during onboarding:", err);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
    const updateData = {};
    const warnings = [];
    // === Basisfelder validieren und bereinigen ===
    if (typeof firstName === "string" && firstName.trim() !== "") {
      updateData.firstName = firstName.trim();
    } else {
      warnings.push("Missing or empty firstName");
    }
    if (typeof lastName === "string" && lastName.trim() !== "") {
      updateData.lastName = lastName.trim();
    } else {
      warnings.push("Missing or empty lastName");
    }
    if (typeof location === "string" && location.trim() !== "") {
      updateData.location = location.trim();
    }
    if (typeof level === "string" && level.trim() !== "") {
      updateData.level = level.trim();
    }
    if (typeof gender === "string" && gender.trim() !== "") {
      updateData.gender = gender.trim();
    }
    if (typeof email === "string" && email.trim() !== "") {
      updateData.email = email.trim();
    }
    // === Geburtsdatum prüfen ===
    if (birthday) {
      const parsedDate = new Date(birthday);
      if (!isNaN(parsedDate)) {
        updateData.birthday = parsedDate;
      } else {
        warnings.push(`Invalid birthday format: "${birthday}"`);
      }
    }
    // === Sports-Array prüfen ===
    if (sports) {
      try {
        const parsedSports = JSON.parse(sports);
        if (Array.isArray(parsedSports)) {
          updateData.sports = parsedSports;
        } else {
          warnings.push("sports is not an array");
        }
      } catch (err) {
        warnings.push("Invalid JSON format in sports field");
      }
    }
    // === Passwort-Änderung prüfen ===
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          error: "All password fields (current, new, confirm) are required.",
        });
      }
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }
    // === Profilbild zu S3 hochladen ===
    if (profilePicture) {
      try {
        console.log("Uploading profile picture to S3:", profilePicture.originalname);
        const s3Response = await uploadToS3(profilePicture);
        console.log("S3 upload successful:", s3Response.Location);
        updateData.profilePicturePath = s3Response.Location;
      } catch (err) {
        console.error("S3 upload failed:", err);
        warnings.push("Failed to upload profile picture");
      }
    }
    // === Wenn keine gültigen Daten enthalten sind ===
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update.",
        warnings,
      });
    }
    console.log("Updating user with data:", updateData);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
    });
    res.json({
      message: "Profile updated successfully.",
      user: updatedUser,
      warnings,
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ error: "Failed to update profile.", details: err.message });
  }
});

module.exports = router;

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts with user info
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            birthday: true,
            profilePicturePath: true,
            location: true,
            level: true,
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  const { description } = req.body;
  const userId = req.user?.userId;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        description,
        userId,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
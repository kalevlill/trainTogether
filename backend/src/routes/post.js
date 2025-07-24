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
  const userId = parseInt(req.user?.userId); 

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

// Get posts by the currently authenticated user
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.user.userId); 

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            birthday: true,
            location: true,
            level: true,
            profilePicturePath: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ error: "Failed to fetch user's posts" });
  }
});

// Delete a post
router.delete("/:id", authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const userId = parseInt(req.user.userId); 

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized or post not found" });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;

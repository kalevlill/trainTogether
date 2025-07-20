require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require('./src/routes/user');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Add this line for parsing URL-encoded form data (important for multer + FormData)
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);
console.log('User routes mounted');

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, firstName: user.firstName },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: "Logged in successfully",
    token,
    user: {
      firstName: user.firstName,
      email: user.email,
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
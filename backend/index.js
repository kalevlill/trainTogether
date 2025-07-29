require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post'); 

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.userId, firstName: decoded.firstName };
    } catch (err) {
      console.warn("Invalid token");
    }
  }
  next();
});


app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes); 
console.log('User and Post routes mounted');


app.get('/', (req, res) => {
  res.send('API is running');
});


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


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user.id,        
        firstName: user.firstName
      },
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
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Server error." });
  }
});

const PORT = process.env.PORT || 4000;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
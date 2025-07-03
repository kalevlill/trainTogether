import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authMiddleware, AuthRequest } from './middleware/authMiddleware'

// .env laden
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET fehlt in der .env-Datei!')
}

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

// ✅ POST /register
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password, location } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Bitte E-Mail, Name und Passwort angeben.' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'E-Mail bereits registriert.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        location,
      },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      message: 'Registrierung erfolgreich',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Interner Serverfehler' })
  }
})

// ✅ POST /login
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Bitte E-Mail und Passwort angeben.' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'Ungültige Anmeldedaten.' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: 'Ungültige Anmeldedaten.' })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  return res.json({
    message: 'Anmeldung erfolgreich',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
})

// Geschützte Route
app.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, location: true },
  })

  if (!user) {
    return res.status(404).json({ error: 'Benutzer nicht gefunden' })
  }

  res.json({ user })
})

// ✅ Health Check
app.get('/', (_, res) => res.send('✅ Auth-Service läuft'))

const PORT = 4000
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`)
})
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

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

// ✅ Health Check
app.get('/', (_, res) => res.send('✅ Auth-Service läuft'))

const PORT = 4000
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`)
})


import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET fehlt in der .env-Datei!')
}

export interface AuthRequest extends Request {
  user?: { userId: string }
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token fehlt oder ist ungültig' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token ungültig oder abgelaufen' })
  }
}

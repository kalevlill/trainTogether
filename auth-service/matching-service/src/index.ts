import express from 'express'
import dotenv from 'dotenv'
import matchRoutes from './routes/match'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/matches', matchRoutes)

app.get('/', (_, res) => {
  res.send('🎯 Matching-Service läuft')
})

const PORT = 4001
app.listen(PORT, () => {
  console.log(`🚀 Matching-Service läuft auf http://localhost:${PORT}`)
})
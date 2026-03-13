import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import gameRoutes from './routes/game.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spellensite')
  .then(() => {
    console.log('Database verbonden')
    app.listen(PORT, () => console.log(`Server draait op poort ${PORT}`))
  })
  .catch((err) => console.error('Database fout:', err))

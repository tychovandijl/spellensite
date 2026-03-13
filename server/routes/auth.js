import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email en wachtwoord zijn verplicht' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Wachtwoord moet minimaal 6 tekens zijn' })
  }
  try {
    const bestaand = await User.findOne({ email })
    if (bestaand) return res.status(409).json({ message: 'Email is al in gebruik' })

    const user = await User.create({ email, password })
    res.status(201).json({ token: signToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: 'Registratie mislukt', error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email en wachtwoord zijn verplicht' })
  }
  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Onjuist email of wachtwoord' })
    }
    if (user.geblokkeerd) {
      return res.status(403).json({ message: 'Account is geblokkeerd' })
    }
    res.json({ token: signToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: 'Inloggen mislukt', error: err.message })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router

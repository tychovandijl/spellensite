import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import GameResult from '../models/GameResult.js'
import User from '../models/User.js'

const router = Router()

// POST /api/game/result — spelresultaat opslaan
router.post('/result', requireAuth, async (req, res) => {
  const { modus, uitkomst, duur } = req.body
  if (!modus || !uitkomst) {
    return res.status(400).json({ message: 'Modus en uitkomst zijn verplicht' })
  }
  try {
    const result = await GameResult.create({
      speler: req.user._id,
      modus,
      uitkomst,
      duur,
    })

    // Stats bijwerken
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { [`stats.${uitkomst}`]: 1 },
    })

    res.status(201).json({ result })
  } catch (err) {
    res.status(500).json({ message: 'Opslaan mislukt', error: err.message })
  }
})

// GET /api/game/history — spelgeschiedenis van ingelogde gebruiker
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await GameResult.find({ speler: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json({ history })
  } catch (err) {
    res.status(500).json({ message: 'Ophalen mislukt', error: err.message })
  }
})

// GET /api/game/stats — statistieken van ingelogde gebruiker
router.get('/stats', requireAuth, (req, res) => {
  res.json({ stats: req.user.stats })
})

export default router

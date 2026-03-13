import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'
import User from '../models/User.js'
import GameResult from '../models/GameResult.js'

const router = Router()

router.use(requireAuth, requireAdmin)

// GET /api/users — alle gebruikers
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: 'Laden mislukt', error: err.message })
  }
})

// PUT /api/users/:id/role — rol wijzigen
router.put('/:id/role', async (req, res) => {
  const { role } = req.body
  if (!['gebruiker', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Ongeldige rol' })
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
  if (!user) return res.status(404).json({ message: 'Gebruiker niet gevonden' })
  res.json({ user })
})

// PUT /api/users/:id/password — wachtwoord resetten door admin
router.put('/:id/password', async (req, res) => {
  const { password } = req.body
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Wachtwoord moet minimaal 6 tekens zijn' })
  }
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Gebruiker niet gevonden' })
    user.password = password
    await user.save()
    res.json({ message: 'Wachtwoord gewijzigd' })
  } catch (err) {
    res.status(500).json({ message: 'Wijzigen mislukt', error: err.message })
  }
})

// POST /api/users/:id/block — blokkeren / deblokkeren
router.post('/:id/block', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'Gebruiker niet gevonden' })
  user.geblokkeerd = !user.geblokkeerd
  await user.save()
  res.json({ user })
})

// DELETE /api/users/:id/score — score resetten
router.delete('/:id/score', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { stats: { gewonnen: 0, verloren: 0, gelijkspel: 0 } },
    { new: true }
  )
  if (!user) return res.status(404).json({ message: 'Gebruiker niet gevonden' })
  await GameResult.deleteMany({ speler: req.params.id })
  res.json({ user })
})

// DELETE /api/users/:id — gebruiker verwijderen
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  await GameResult.deleteMany({ speler: req.params.id })
  res.json({ message: 'Gebruiker verwijderd' })
})

export default router

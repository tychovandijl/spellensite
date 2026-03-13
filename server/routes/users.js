import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'
import User from '../models/User.js'
import GameResult from '../models/GameResult.js'

const router = Router()

router.use(requireAuth, requireAdmin)

// GET /api/users — alle gebruikers
router.get('/', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.json({ users })
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

// GET /api/admin/stats — totale activiteit
router.get('/admin/stats', async (_req, res) => {
  const [totalUsers, totalGames] = await Promise.all([
    User.countDocuments(),
    GameResult.countDocuments(),
  ])
  res.json({ totalUsers, totalGames })
})

export default router

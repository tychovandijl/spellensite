import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Niet ingelogd' })
  }

  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user || user.geblokkeerd) {
      return res.status(401).json({ message: 'Account niet geldig' })
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Ongeldig token' })
  }
}

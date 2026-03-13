import mongoose from 'mongoose'

const gameResultSchema = new mongoose.Schema(
  {
    speler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modus: { type: String, enum: ['vs-ai', 'vs-ai-makkelijk', 'vs-ai-gemiddeld', 'vs-ai-moeilijk', 'vs-speler'], required: true },
    uitkomst: { type: String, enum: ['gewonnen', 'verloren', 'gelijkspel'], required: true },
    duur: { type: Number }, // in seconden
  },
  { timestamps: true }
)

export default mongoose.model('GameResult', gameResultSchema)

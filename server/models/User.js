import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['gebruiker', 'admin'], default: 'gebruiker' },
    geblokkeerd: { type: Boolean, default: false },
    stats: {
      gewonnen: { type: Number, default: 0 },
      verloren: { type: Number, default: 0 },
      gelijkspel: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.checkPassword = function (kandidaat) {
  return bcrypt.compare(kandidaat, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)

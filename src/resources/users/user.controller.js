import { db } from '../../utils/db.js'
import bcrypt from 'bcrypt'
import {create, verify} from '../../utils/token.js'

async function register (req, res, next) {
  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  const result = await db.execute({
    sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *',
    args: [req.body.name, req.body.email, hashedPassword]
  })
  
  const user = result.rows[0]
  const token = await create({ userId: user.id })
  
  return res.status(201).json({token})
}

async function login (req, res, next) {
    const password = req.body.password

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [req.body.email]
    })

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const authToken = await create({ userId: user.id })

    return res.status(200).json({ token: authToken })
}

async function findOrCreateUser(profile) {
  const email = profile.emails[0].value
  const name = profile.displayName

  let result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  })

  if (result.rows.length > 0) {
    return result.rows[0]
  }

  // Create new user
  result = await db.execute({
    sql: 'INSERT INTO users (name, email) VALUES (?, ?) RETURNING *',
    args: [name, email] // No password for OAuth
  })

  return result.rows[0]
}

export { register, login, findOrCreateUser }

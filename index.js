import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieSession from 'cookie-session'

import todos from './src/resources/todo/todo.routes.js'
import users from './src/resources/users/user.routes.js'
import passport from './src/middleware/passport.js'
import { create } from './src/utils/token.js'
import requireAuth from './src/middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.use(todos)
app.use(users)
app.use(
  cookieSession({
    name: 'google-auth-session2',
    keys: ['key1', 'key2'],
    maxAge: 60 * 1000 // 1 minute
  })
)

app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize())
app.use(passport.session())


app.get('/', requireAuth, (req, res) => {
  res.send('Hello, World!')
})

app.get('/failed', (req, res) => {
  console.log('Failed attempt')
  res.send('Failed')
})

app.get('/success', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = await create({ userId: req.user.id })
  res.json({ token })
})

app.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  async (req, res) => {
    const token = await create({ userId: req.user.id })
    res.redirect(`/success?token=${token}`)
  }
)

app.get('/logout', (req, res, next) => {
  req.session = null;
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

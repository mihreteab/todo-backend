import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser } from '../resources/users/user.controller.js'
import { db } from '../utils/db.js'

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  console.log('Deserializing id:', id, typeof id);
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    })
    console.log('Deserialized user:', result.rows[0]);
    done(null, result.rows[0])
  } catch (err) {
    console.error('Deserialize error:', err);
    done(err, null)
  }
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
      passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await findOrCreateUser(profile)
        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

export default passport;

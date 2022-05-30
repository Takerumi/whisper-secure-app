const GoogleStrategy = require('passport-google-oauth20').Strategy,
  VKontakteStrategy = require('passport-vkontakte').Strategy,
  User = require('../models/user')

module.exports = function (passport) {
  function detectEnvUri() {
    if (process.env.NODE_ENV === 'development') {
      const absoluteURI = 'http://127.0.0.1:3000'
      return absoluteURI
    }
    if (process.env.NODE_ENV === 'production') {
      const absoluteURI = 'https://bormans-secrets.herokuapp.com/'
      return absoluteURI
    }
  }

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(User.createStrategy())

  // OAuth Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${detectEnvUri()}/auth/google/secrets`,
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ googleId: profile.id }, (err, user) =>
          cb(err, user)
        )
      }
    )
  )

  // OAuth VK
  passport.use(
    new VKontakteStrategy(
      {
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL: `${detectEnvUri()}/auth/vkontakte/secrets`,
      },
      (accessToken, refreshToken, params, profile, done) => {
        User.findOrCreate({ vkontakteId: profile.id }, (err, user) =>
          done(err, user)
        )
      }
    )
  )
}

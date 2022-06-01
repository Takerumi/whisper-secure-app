const GoogleStrategy = require('passport-google-oauth20').Strategy,
  VKontakteStrategy = require('passport-vkontakte').Strategy,
  User = require('../models/user')

module.exports = function (passport) {
  passport.use(User.createStrategy())

  // OAuth Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          'https://bormans-secrets.herokuapp.com/auth/google/secrets',
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ googleId: profile.id }, (err, user) => {
          return cb(err, user)
        })
      }
    )
  )

  // OAuth VK
  passport.use(
    new VKontakteStrategy(
      {
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL:
          'https://bormans-secrets.herokuapp.com//auth/vkontakte/secrets',
      },
      (accessToken, refreshToken, params, profile, done) => {
        User.findOrCreate({ vkontakteId: profile.id }, (err, user) =>
          done(err, user)
        )
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(function (user) {
        done(null, user)
      })
      .catch(done)
  })
}

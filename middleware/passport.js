const passport = require('passport'),
  passportLocalMongoose = require('passport-local-mongoose'),
  GoogleStrategy = require('passport-google-oauth20').Strategy,
  VKontakteStrategy = require('passport-vkontakte').Strategy,
  findOrCreate = require('mongoose-findorcreate'),
  User = require('../models/user')

module.exports = function (passport) {
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
        callbackURL: 'http://127.0.0.1:3000/auth/google/secrets',
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
        callbackURL: 'http://127.0.0.1:3000/auth/vkontakte/secrets',
      },
      (accessToken, refreshToken, params, profile, done) => {
        User.findOrCreate({ vkontakteId: profile.id }, (err, user) =>
          done(err, user)
        )
      }
    )
  )
}

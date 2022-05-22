require('dotenv').config()
const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  findOrCreate = require('mongoose-findorcreate'),
  session = require('express-session'),
  passport = require('passport'),
  passportLocalMongoose = require('passport-local-mongoose'),
  GoogleStrategy = require('passport-google-oauth20').Strategy,
  VKontakteStrategy = require('passport-vkontakte').Strategy,
  secret = process.env.SECRET,
  DB_HOST = process.env.DB_HOST,
  port = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(DB_HOST)

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  vkontakteId: String,
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model('User', userSchema)

passport.use(User.createStrategy())

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// OAuth Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/google/secrets',
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user))
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

app.route('/').get((req, res) => {
  res.render('home')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

app.get(
  '/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/secrets')
  }
)

app.get('/auth/vkontakte', passport.authenticate('vkontakte'))

app.get(
  '/auth/vkontakte/secrets',
  passport.authenticate('vkontakte', {
    successRedirect: '/secrets',
    failureRedirect: '/login',
  })
)

app.route('/secrets').get((req, res) => {
  if (req.isAuthenticated()) {
    res.render('secrets')
  } else {
    res.redirect('/login')
  }
})

app
  .route('/register')
  .get((req, res) => {
    res.render('register')
  })
  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err)
          res.redirect('/register')
        } else {
          passport.authenticate('local')(req, res, () => {
            res.redirect('/secrets')
          })
        }
      }
    )
  })

app
  .route('/login')
  .get((req, res) => {
    res.render('login')
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    })

    req.login(user, (err) => {
      if (err) {
        console.log(err)
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets')
        })
      }
    })
  })

app.get('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Successfully logOut')
    }
  })
  res.redirect('/')
})

app.listen(port, () => console.log(`Server started on port ${port}`))

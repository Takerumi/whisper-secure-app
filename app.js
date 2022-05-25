require('dotenv').config()
const express = require('express'),
  app = express(),
  mongooseConnectDB = require('./db'),
  User = require('./models/user'),
  session = require('express-session'),
  passport = require('passport'),
  flash = require('connect-flash'),
  secret = process.env.SECRET,
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

app.use(flash())

mongooseConnectDB()

// passport.use(User.createStrategy())

// passport.serializeUser((user, done) => {
//   done(null, user.id)
// })

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user)
//   })
// })

// // OAuth Google
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://127.0.0.1:3000/auth/google/secrets',
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user))
//     }
//   )
// )

// // OAuth VK
// passport.use(
//   new VKontakteStrategy(
//     {
//       clientID: process.env.VK_CLIENT_ID,
//       clientSecret: process.env.VK_CLIENT_SECRET,
//       callbackURL: 'http://127.0.0.1:3000/auth/vkontakte/secrets',
//     },
//     (accessToken, refreshToken, params, profile, done) => {
//       User.findOrCreate({ vkontakteId: profile.id }, (err, user) =>
//         done(err, user)
//       )
//     }
//   )
// )

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
  User.find({ secret: { $ne: null } }, (err, foundUsers) => {
    if (err) {
      console.log(err)
    } else {
      if (foundUsers) {
        res.render('secrets', { usersWithSecrets: foundUsers })
      }
    }
  })
})

app
  .route('/submit')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render('submit')
    } else {
      res.redirect('/login')
    }
  })
  .post((req, res) => {
    const newSecret = req.body.secret

    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err)
      } else {
        if (foundUser) {
          foundUser.secret = newSecret
          foundUser.save(() => {
            res.redirect('/secrets')
          })
        }
      }
    })
  })

app
  .route('/register')
  .get((req, res) => {
    res.render('register', { expressFlash: req.flash('Error') })
  })
  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          req.flash('Error', 'Registration error. Please, try again')
          return res.redirect('/register')
        }
        // Calls next middleware to authenticate with passport
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets')
        })
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

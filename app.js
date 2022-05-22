require('dotenv').config()
const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  session = require('express-session'),
  passport = require('passport'),
  passportLocalMongoose = require('passport-local-mongoose'),
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
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model('User', userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.route('/').get((req, res) => {
  res.render('home')
})

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

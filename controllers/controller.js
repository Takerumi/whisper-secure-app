const User = require('../models/user'),
  passport = require('passport')

class Controller {
  // Render Home page
  getHomePage(req, res) {
    res.render('home')
  }
  // Render Login page
  getLoginPage(req, res) {
    res.render('login')
  }
  // Render Signup page
  getRegisterPage(req, res) {
    res.render('register', { expressFlash: req.flash('Error') })
  }
  getSecretsPage(req, res) {
    User.find({ secret: { $ne: null } }, (err, foundUsers) => {
      if (err) {
        req.flash('Error', err)
      } else {
        if (foundUsers) {
          res.render('secrets', { usersWithSecrets: foundUsers })
        }
      }
    })
  }
  // Login User
  loginUser(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    })

    req.login(user, (err) => {
      if (err) {
        req.flash('Error', 'Login error. Please, try again')
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')
      })
    })
  }
  // Register User
  registerUser(req, res) {
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
  }
}

module.exports = new Controller()

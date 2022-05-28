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
  // Render Submit page
  getSubmitPage(req, res) {
    if (req.isAuthenticated()) {
      res.render('submit')
    } else {
      res.redirect('/login')
    }
  }
  // Render Secrets page
  getSecretsPage(req, res) {
    if (req.isAuthenticated()) {
      User.find({ secret: { $ne: null } }, (err, foundUsers) => {
        if (err) {
          req.flash('error', `${err.name}: ${err.message}`)
        } else {
          if (foundUsers) {
            res.render('secrets', { usersWithSecrets: foundUsers })
          }
        }
      })
    } else {
      res.redirect('/login')
    }
  }
  // Login User
  loginUser(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    })

    req.login(user, (err) => {
      if (err) {
        req.flash('error', `${err.name}: ${err.message}`)
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
          req.flash('error', `${err.name}: ${err.message}`)
          return res.redirect('/register')
        }
        // Calls next middleware to authenticate with passport
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets')
        })
      }
    )
  }
  // LogOut User
  logoutUser(req, res) {
    req.logOut((err) => {
      if (err) {
        req.flash('error', `${err.name}: ${err.message}`)
      }
    })
    return res.redirect('/')
  }
  // Send new secret
  submitSecret(req, res) {
    const newSecret = req.body.secret

    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        req.flash('error', `${err.name}: ${err.message}`)
      } else {
        if (foundUser) {
          foundUser.secret = newSecret
          foundUser.save(() => {
            res.redirect('/secrets')
          })
        }
      }
    })
  }
}

module.exports = new Controller()

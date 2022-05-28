const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Controller = require('../controllers/controller')

router.route('/').get(Controller.getHomePage)

router.route('/login').get(Controller.getLoginPage).post(Controller.loginUser)

router
  .route('/register')
  .get(Controller.getRegisterPage)
  .post(Controller.registerUser)

router.route('/secrets').get(Controller.getSecretsPage)

router.get('/logout', Controller.logoutUser)

router
  .route('/submit')
  .get(Controller.getSubmitPage)
  .post(Controller.submitSecret)

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
)

router.get('/auth/vkontakte', passport.authenticate('vkontakte'))

router.get(
  '/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/secrets')
  }
)

router.get(
  '/auth/vkontakte/secrets',
  passport.authenticate('vkontakte', {
    successRedirect: '/secrets',
    failureRedirect: '/login',
  })
)

module.exports = router

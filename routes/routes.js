const express = require('express'),
  router = express.Router(),
  Controller = require('../controllers/controller')

router.route('/').get(Controller.getHomePage)

router.route('/login').get(Controller.getLoginPage).post(Controller.loginUser)

router
  .route('/register')
  .get(Controller.getRegisterPage)
  .post(Controller.registerUser)

router.route('/secrets').get(Controller.getSecretsPage)

// router.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['profile'] })
// )

// router.get(
//   '/auth/google/secrets',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/secrets')
//   }
// )

// router.get('/auth/vkontakte', passport.authenticate('vkontakte'))

// router.get(
//   '/auth/vkontakte/secrets',
//   passport.authenticate('vkontakte', {
//     successRedirect: '/secrets',
//     failureRedirect: '/login',
//   })
// )

// router
//   .route('/submit')
//   .get((req, res) => {
//     if (req.isAuthenticated()) {
//       res.render('submit')
//     } else {
//       res.redirect('/login')
//     }
//   })
//   .post((req, res) => {
//     const newSecret = req.body.secret

//     User.findById(req.user.id, (err, foundUser) => {
//       if (err) {
//         console.log(err)
//       } else {
//         if (foundUser) {
//           foundUser.secret = newSecret
//           foundUser.save(() => {
//             res.redirect('/secrets')
//           })
//         }
//       }
//     })
//   })

// router.get('/logout', (req, res) => {
//   req.logOut((err) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('Successfully logOut')
//     }
//   })
//   res.redirect('/')
// })

module.exports = router

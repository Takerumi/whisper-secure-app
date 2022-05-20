require('dotenv').config()

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  encrypt = require('mongoose-encryption'),
  secret = process.env.SECRET,
  DB_HOST = process.env.DB_HOST,
  port = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(DB_HOST)

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ['password'],
})

const User = new mongoose.model('User', userSchema)

app.route('/').get((req, res) => {
  res.render('home')
})

app
  .route('/login')
  .get((req, res) => {
    res.render('login')
  })
  .post((req, res) => {
    const username = req.body.username,
      password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render('secrets')
          } else {
            console.log('Authentication failed')
          }
        }
      } else {
        console.log(err)
      }
    })
  })

app
  .route('/register')
  .get((req, res) => {
    res.render('register')
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    })
    newUser.save((err) => {
      if (!err) {
        res.render('secrets')
      } else {
        console.log(err)
      }
    })
  })

app.listen(port, () => console.log(`Server started on port ${port}`))

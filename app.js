require('dotenv').config()

const express = require('express'),
  app = express(),
  routes = require('./routes/routes'),
  mongooseConnectDB = require('./db'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  port = process.env.PORT || 3000

require('./middleware/passport')(passport)

app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

mongooseConnectDB()

app.use('/', routes)

app.listen(port, () => console.log(`Server started on port ${port}`))

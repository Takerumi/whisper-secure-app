const mongoose = require('mongoose'),
  findOrCreate = require('mongoose-findorcreate'),
  passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  vkontakteId: String,
  secret: String,
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', userSchema)

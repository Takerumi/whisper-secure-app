const mongoose = require('mongoose'),
  config = require('./config/config')
mongoose.Promise = global.Promise

function mongooseConnectDB() {
  mongoose
    .connect(config.dbURL)
    .then((result) =>
      console.log('Mongoose connected to ', result.connections[0].host)
    )
    .catch((err) => console.log('error connecting to the database', err))
}

module.exports = mongooseConnectDB

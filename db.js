const mongoose = require('mongoose')
mongoose.Promise = global.Promise

function mongooseConnectDB() {
  mongoose
    .connect(process.env.DB_HOST)
    .then((result) =>
      console.log('Mongoose connected to ', result.connections[0].host)
    )
    .catch((err) => console.log('error connecting to the database', err))
}

module.exports = mongooseConnectDB

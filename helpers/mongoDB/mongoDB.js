const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error(error))
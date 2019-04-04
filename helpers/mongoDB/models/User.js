const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Favorites = {
  name: { type: String },
  upc: { type: String },
  image: { type: String },
  description: { type: String },
};

const Purshases = {
  items: {},
  date: { type: String }
};

const UserShema = new Schema({
  userId: { type: String },
  name: { type: String },
  phone: { type: Number },
  location: {},
  favorites: [Favorites],
  purshases: [Purshases]
});

const User = mongoose.model('User', UserShema);

module.exports = User;

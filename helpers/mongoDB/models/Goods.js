const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GoodsShema = new Schema({
  name: { type: String },
  upc: { type: String },
  image: { type: String },
  description: { type: String },
});

const Goods = mongoose.model('Goods', GoodsShema);

module.exports = Goods;

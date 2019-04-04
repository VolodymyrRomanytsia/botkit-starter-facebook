/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
const env = require('node-env-file');
const BotError = require('../errors/error');
const errors = require('../errors/error-messages');
const Goods = require('../mongoDB/models/Goods');

env(`${__dirname}../../../.env`);

const bestbuy = require('bestbuy')(process.env.BESTBUY_TOKEN);
const { to } = require('await-to-js');

module.exports = async () => {
  const [err, data] = await to(bestbuy.products(
    'categoryPath.id=abcat0100000',
    { show: 'name,upc,longDescription,image',page:1,pageSize:10 },
  ));
  if (err) throw new BotError(errors.bestBuyError);
  if (!data) throw new BotError(errors.noAviableProducts);
  
  console.log(data)

  Object.keys(data.products).forEach(async (key) => {
    const product = data.products[key];
    const item = {
      name: product.name,
      upc: product.upc,
      image: product.image,
      description: product.longDescription,
    };
    Goods.findOneAndUpdate({ upc: item.upc },
      item, { new: true, upsert: true }, (findErr, good) => {
        if (findErr) throw new BotError(errors.findGoodsError);
        good.save((saveError) => {
          if (saveError) throw new BotError(errors.saveDbError);
        });
      });
  });
};

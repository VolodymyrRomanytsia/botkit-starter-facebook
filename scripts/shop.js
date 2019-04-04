const { to } = require('await-to-js');
const store = require('../helpers/products/store.js');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');
const Goods = require('../helpers/mongoDB/models/Goods');

module.exports = async (bot, message) => {
  let [dberr, goods] = await to(Goods.find());
  if (dberr) throw new BotError(errors.findGoodsError);

  if (!goods.length) await store();

  [dberr, goods] = await to(Goods.find());
  if (dberr) throw new BotError(errors.noAviableProducts);

  const elements = [];
  goods.forEach((item) => {
    const element = {
      title: item.name,
      image_url: item.image,
      buttons: [
        {
          type: 'postback',
          title: 'Info',
          payload: `getSingleInfofor:${item.upc}`,
        }
      ],
    };
    elements.push(element);
  });

  const attachment = {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements,
    },
  };

  bot.reply(message, {
    attachment,
  });
};

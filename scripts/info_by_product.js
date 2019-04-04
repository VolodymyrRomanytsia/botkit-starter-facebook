const { to } = require('await-to-js');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');
const Goods = require('../helpers/mongoDB/models/Goods');
const User = require('../helpers/mongoDB/models/User');

module.exports = async (bot, message, upc) => {
  const userId = message.sender.id;
  const [dberr, good] = await to(Goods.findOne({ upc }));
  if (dberr) throw new BotError(errors.findGoodsError);

  await User.findOne({ userId: userId }, (error, usr) => {
    if (error) throw new BotError(errors.findUserError);

    usr.favorites.push(good);

    usr.save((err) => {
      if (err) {
        if (err) throw new BotError(errors.saveDbError);
      }
    });
  });

  const attachment = {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: good.name,
          image_url: good.image,
          subtitle: good.description,
          buttons: [
            {
              type: 'postback',
              title: 'Buy',
              payload: `buyProduct:${good.upc}`,
            },
            {
              type: 'postback',
              title: 'Main menu',
              payload: 'Main menu',
            },
          ],
        },
      ],
    },
  };

  bot.reply(message, {
    attachment,
  });
};

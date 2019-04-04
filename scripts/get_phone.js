const { to } = require('await-to-js');
const moment = require('moment');
const Goods = require('../helpers/mongoDB/models/Goods');
const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');


module.exports = async (bot, message, upc) => {
  let content_type;
  let text;
  const userId = message.sender.id;


  const [dbErr, good] = await to(Goods.findOne({ upc }));
  if (dbErr) throw new BotError(errors.findGoodsError);

  const user = await User.findOne({ userId: userId }, (error, usr) => {
    if (error) throw new BotError(errors.findUserError);

      const date = moment().format('MMM Do ');
      order = { date, items: good};
      usr.purshases.push(order);
      usr.save((err) => {
        if (err) {
          throw new BotError(errors.saveDbError);
        }
      });
    });

  if (user.phone) {
    content_type = 'location';
    text = 'Please share your location for delivery';
  } else {
    content_type = 'user_phone_number';
    text = 'Please share your phone';
  }

  bot.reply(message, {
    text,
    quick_replies: [
      {
        content_type,
      },
    ],
  });
};

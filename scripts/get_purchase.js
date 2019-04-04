const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

module.exports = async (bot, message, date) => {
  const userId = message.sender.id;
  await User.findOne({ userId: userId })
    .exec((error, user) => {
      if (error) throw new BotError(errors.findUserError);

    const order = user.purshases.filter(item => item.date === date);

    const attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: order.items.name,
            image_url: order.items.image,
            buttons: [
              {
                type: 'postback',
                title: 'Repeat',
                payload: `getPurchase:${order.items.upc}`
              },
              {
                type: 'postback',
                title: 'Return',
                payload: 'My purchases'
              }
            ]
          }
        ]
      }
    }

    bot.reply(message, {
      attachment,
    });
  });
}
    


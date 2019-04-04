const { to } = require('await-to-js');
const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');


module.exports = async (bot, message) => {
  const elements = [];
  const userId = message.sender.id;
  const [err, user] = await to(User.findOne({ userId: userId }));
  if (err) throw new BotError(errors.findUserError);

  if (!user.favorites.length) {
    bot.reply(message, {
      text: 'Your favorites is empty',
      quick_replies: [
         {
          content_type: 'text',
          title: 'Return',
          payload: 'Return'
        }
      ]
    });
  
  } else {
    user.favorites.forEach((item) => {
      const element = {
        title: item.name,
        image_url: item.image,
        buttons: [
          {
            type: 'postback',
            title: 'Info',
            payload: `getSingleInfofor:${item.upc}`,
          },
          {
            type: 'postback',
            title: 'Return',
            payload: 'Return'
          }
        ]
      };
      elements.push(element);
    });

    const attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements
      },
    };

    bot.reply(message, {
      attachment,
    });
  }
};

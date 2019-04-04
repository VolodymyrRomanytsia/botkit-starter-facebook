const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

module.exports = async (bot, message) => {
  const userId = message.sender.id;
  const phone = message.message.quick_reply.payload;

  await User.findOne({ userId: userId }, (error, user) => {
    if (error) throw new BotError(errors.findUserError);
    if (!user.phone) {
      user.phone = phone;
      user.save((err) => {
        if (err) {
          if (err) throw new BotError(errors.saveDbError);
        }
      });
    }
  });

  bot.reply(message, {
    text: 'Please share your location for delivery',
    quick_replies: [
      {
        content_type: 'location',
      },
    ],
  });
};

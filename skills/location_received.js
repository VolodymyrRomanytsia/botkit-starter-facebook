const { to } = require('await-to-js');
const Goods = require('../helpers/mongoDB/models/Goods');
const moment = require('moment');
const shedule = require('node-schedule');
const nps = require('../scripts/nps');
const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

module.exports = function (controller) {
  controller.on('message_received', async (bot, message) => {
    const userId = message.sender.id;
    if (!message.text) {
      if (message.attachments && message.attachments[0]) {
        let location;
        if (message.attachments[0].payload.coordinates) {
          location = message.attachments[0].payload.coordinates;
        }

        await User.findOne({ userId: userId })
          .exec((error, user) => {
            if (error) throw new BotError(errors.findUserError);
            user.location = location
            user.save((err) => {
              if (err) {
                throw new BotError(errors.saveDbError);
              }
            });
          });
        bot.reply(message, 'Our courier will contact you within 2 hours');

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate() + 2;
        const hour = date.getDate();
        shedule.scheduleJob(
          '* * hour day month year',
          () => {
            nps(bot, message);
          },
        );
      }
    }
  });
};

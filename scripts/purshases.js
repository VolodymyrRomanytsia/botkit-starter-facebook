/* eslint-disable array-callback-return */
const { to } = require('await-to-js');
const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

const divideArr = (arr) => {
  const res = [];

  while (arr.length) {
    let max = 4;
    if (arr.length <= 4) max = arr.length;
    res.push(arr.splice(0, max));
  }
  return res;
};


module.exports = async (bot, message) => {
  let buttons = [];
  const userId = message.sender.id;
  const [err, user] = await to(User.findOne({ userId: userId }));
  if (err) throw new BotError(errors.findUserError);

  if (!user.purshases.length) {
    bot.reply(message, {
      text: 'You have no purshases',
      quick_replies: [
         {
          content_type: 'text',
          title: 'Return',
          payload: 'Return'
        }
      ]
    });
  } else {
    user.purshases.map((el) => {
      const element = {
        type: 'postback',
        title: el.date,
        payload: `getOrderByDate:${el.date}`,
      };
      buttons.push(element);
    });

    buttons = divideArr(buttons);

    for (let i = 0; i < buttons.length; i++) {
      const attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Here is your purshases',
              buttons: buttons[i],
            },
          ],
        },
      };

      setTimeout(() => {
        bot.reply(message, {
          attachment,
          quick_replies: [
            {
             content_type: 'text',
             title: 'Return',
             payload: 'Return'
           }
         ]
        });
      }, 1000);
    }
  }
};

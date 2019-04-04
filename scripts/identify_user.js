/* eslint-disable func-names */
const axios = require('axios');
const { to } = require('await-to-js');
const User = require('../helpers/mongoDB/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

const getName = async (url) => {
  const [err, response] = await to(axios.get(url));
  if (err) throw new BotError(errors.getUserData);
  const data = response.data;
  return `${data.first_name} ${data.last_name}`;
};

module.exports = function (controller) {
  controller.on('message_received', async (bot, message) => {
    let fullName;
    const userId = message.sender.id;

    let user = await User.findOne({ userId: userId });

    if (!user) {
      const usersPublicProfile = `https://graph.facebook.com/v2.6/${userId}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${process.env.page_token}`;
      fullName = await getName(usersPublicProfile);

      user = new User({
        userId: userId,
        name: fullName,
        phone: '',
        favorites: [],
        myPurshases: [],
      });

      user.save((err) => {
        if (err) throw new BotError(errors.saveDbError);
      });
    }

  });
};

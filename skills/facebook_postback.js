const mainMenu = require('../scripts/main_menu');
const info = require('../scripts/info_by_product');
const getPhone = require('../scripts/get_phone');
const shop = require('../scripts/shop');
const getOrder = require('../scripts/get_purchase');
const User = require('../helpers/mongoDB/models/User');

module.exports = (controller) => {
  controller.on('facebook_postback', async (bot, message) => {
    let id;
    let messagePayload = message.payload;
    const senderPsid = message.sender.id;
    const user = await User.findOne({ psid: senderPsid });
    if (messagePayload.match('getSingleInfofor:')) {
      [messagePayload, id] = messagePayload.split(':');
    }
    if (messagePayload.match('buyProduct:')) {
      [messagePayload, id] = messagePayload.split(':');
    }
    if (messagePayload.match('getPurchase:')) {
      [messagePayload, id] = messagePayload.split(':');
    }

    switch (messagePayload) {
      case 'Get Started':
      case 'Main menu':
      case 'Return':
        mainMenu(bot, message);
        break;
      case 'Product catalog':
        shop(bot, message);
        break;
      case 'getSingleInfofor':
        info(bot, message, id);
        break;
      case 'buyProduct':
        getPhone(bot, message, id);
        break;
      case 'getPurchase':
        getPurchase(bot, message, id);
        break;
      case 'My purchases':
        myPurchases(bot, message);
        break;
      default:
        bot.reply(message, 'Unknown commnand');
        break;
    }
  });
};
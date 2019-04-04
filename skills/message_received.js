const shop = require('../scripts/shop');
const getLocation = require('../scripts/get_location');
const favorites = require('../scripts/favorites');
const myPurchases = require('../scripts/purshases');
const mainMenu = require('../scripts/main_menu');

module.exports = (controller) => {
  controller.on('message_received', async (bot, message) => {
    if (message.message.quick_reply) {
      if ((/^\+\d{7,12}/g).test(message.message.quick_reply.payload)) getLocation(bot, message);
    }
    switch (message.message.text) {
      case 'Shop':
      case 'Go to shop':
        shop(bot, message);
        break;
      case 'Favorites':
        favorites(bot, message);
        break;
      case 'My purchases':
        myPurchases(bot, message);
        break;
      case 'Return':
        mainMenu(bot, message);
        break;
      default:
        break;
    }
  });
};

var debug = require('debug')('botkit:onboarding');

module.exports = function(controller) {

    controller.on('facebook_optin', function(bot, message) {
        debug('Starting an onboarding experience!');
        bot.reply(message, 'Look to Up and enjoy. More!');
    });

}

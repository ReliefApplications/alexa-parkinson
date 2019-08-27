const Locale = require('../locale/es').AlexaCancel;

/**
 * End session with a good-bye message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    response.say( Locale.cancel() );
    response.send();
    response.shouldEndSession(false);
};
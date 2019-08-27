const Locale = require('../locale/es').AlexaStop;

/**
 * End session with a good-bye message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        response.say( Locale.stop() );
        response.send();
        response.shouldEndSession(true);
        resolve();
    });
};
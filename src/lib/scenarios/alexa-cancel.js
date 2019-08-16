/**
 * End session with a good-bye message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    response.say('A tus órdenes. Que quires hacer ?');
    response.send();
    response.shouldEndSession(false);
};
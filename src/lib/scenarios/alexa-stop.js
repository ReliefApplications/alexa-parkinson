/**
 * End session with a good-bye message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        response.say('Vale. Detengo la Skill.');
        response.send();
        response.shouldEndSession(true);
        resolve();
    });
};
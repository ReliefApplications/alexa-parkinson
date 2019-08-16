const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');

/**
 * Call someone
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    const msg = 'Este functionalidad no es lista. Quieres hacer otra cosa?'
    response.say(msg);
    response.send();
    MemoryHandler.setMemory(new SkillMemory('Call', msg, {}, 
        (req, res) => { return require('./help')(req, res); },
        (req, res) => { return require('./alexa-stop')(req, res); }
    ));
    return response.shouldEndSession(false);
}
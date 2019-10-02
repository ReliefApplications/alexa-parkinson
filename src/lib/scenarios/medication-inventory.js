const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');

/**
 * Display user's medication inventory
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    const msg = 'Todavía no lo sé. Cómo puedo ser más útil ?';
    response.say(msg);
    response.send();
    MemoryHandler.setMemory(new SkillMemory('MedicationLeft', msg, {}, 
        (req, res) => { return require('./help')(req, res); },
        (req, res) => { return require('./alexa-confirmation')(req, res); }
    ));
    return response.shouldEndSession(false);
}
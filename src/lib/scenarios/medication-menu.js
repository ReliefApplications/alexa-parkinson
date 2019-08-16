const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');

/**
 * Display 'Mi Medication' menu
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    const msg = 'Ok, pregúntame por tu medicación programada. Por ejemplo di: ¿Qué medicación tengo que tomar hoy? O pregúntame “¿Qué puedo hacer?”'
    response.say(msg);
    response.send();
    MemoryHandler.setMemory(new SkillMemory('MiMedication', msg, {}, 
        (req, res) => { return require('./help')(req, res); },
        (req, res) => { return require('./alexa-stop')(req, res); }
    ));
    return response.shouldEndSession(false);
}
const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');

/**
 * Display an help message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        let msg = 'Puedes crear un calendario de medicación. Di por ejemplo “Nueva medicación” \n ';
        msg += 'Puedes preguntar qué medicación tienes en tu calendario. Di por ejemplo “¿Qué medicamentos tengo que tomar hoy?” \n';
        msg += 'También puedes obtener información sobre cualquier medicación relacionada con el Parkinson. Di por ejemplo: “Efectos secundarios del Sinemed” \n';
        msg += 'Además puedes llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación”'

        MemoryHandler.setMemory(new SkillMemory('Help', msg, {}, undefined, undefined));

        response.say(msg);
        response.send();
        response.shouldEndSession(false);
        resolve();
    });
}
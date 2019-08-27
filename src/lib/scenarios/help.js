const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').AlexaHelp;

/**
 * Display an help message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        MemoryHandler.setMemory(new SkillMemory('Help', Locale.help(), {}, undefined, undefined));

        response.say( Locale.help() );
        response.reprompt( Locale.reprompt() );
        response.send();
        response.shouldEndSession(false);
        resolve();
    });
}
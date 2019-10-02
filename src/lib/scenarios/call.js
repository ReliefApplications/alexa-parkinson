const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').Call;
const LocaleGeneral = require('../locale/es').General;

/**
 * Call someone
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    response.say( LocaleGeneral.workInProgress() );
    response.send();
    MemoryHandler.setMemory(new SkillMemory('Call', LocaleGeneral.workInProgress(), {}, 
        (req, res) => { return require('./help')(req, res); },
        (req, res) => { return require('./alexa-confirmation')(req, res); }
    ));
    return response.shouldEndSession(false);
}
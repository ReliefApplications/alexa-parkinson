const Locale = require('../locale/es').AlexaConfirmation;
const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const LocaleGeneral = require('../locale/es').General;
/**
 * End session with a good-bye message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {

        MemoryHandler.setMemory(new SkillMemory(
            'Confirmation', LocaleGeneral.continue(), {},
            (req, res) => { return require('./alexa-stop')(req, res); },
            (req, res) => { return require('./help')(req, res); }
        ));

        response.say( Locale.confirmation() );
        response.send();
        response.shouldEndSession(false);
        resolve();
    });
};
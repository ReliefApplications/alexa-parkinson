const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').ParkinsonMoreOptions;
const LocaleGeneral = require('../locale/es').General;
const Constants = require('./../../Constants');
const Utils = require('./../../Utils').Utils;

/**
 * Display options
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        
        if ( Utils.supportsDisplay(request) ) {
            response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), Locale.text() ));
        }

        MemoryHandler.setMemory(new SkillMemory(
            'Help', LocaleGeneral.continue(), {},
            (req, res) => { return require('./parkinsonOptions')(req, res); },
            (req, res) => { return require('./alexa-confirmation')(req, res); }
        ));

        response.say( Locale.options() );
        response.reprompt( Locale.reprompt() );
        response.send();
        response.shouldEndSession(false);
        resolve();
    });
}
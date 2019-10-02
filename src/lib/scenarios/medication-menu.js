const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Utils = require('./../../Utils').Utils;
const Constants = require('./../../Constants');
const Locale = require('../locale/es').MedicationMenu;

/**
 * Display 'Mi Medication' menu
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        response.say( Locale.text() );
        response.reprompt( Locale.reprompt() )

        if ( Utils.supportsDisplay(request) ) {
            response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), Locale.text() ));
        }

        response.send();

        MemoryHandler.setMemory(new SkillMemory('MiMedication', Locale.text(), {}, 
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-confirmation')(req, res); }
        ));

        response.shouldEndSession(false);
        resolve();    
    });
}
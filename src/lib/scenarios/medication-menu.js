const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Utils = require('./../../Utils').Utils;
const Constants = require('./../../Constants');

/**
 * Display 'Mi Medication' menu
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {
        const msg = Utils.getText(Constants.texts.mymedication);
        response.say(msg.text);
        response.reprompt("Qué quires hacer. Puedes preguntar “¿Qué puedo hacer?”.")

        if ( Utils.supportsDisplay(request) ) {
            response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, msg.title, msg.text));
        }

        response.send();

        MemoryHandler.setMemory(new SkillMemory('MiMedication', msg, {}, 
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.shouldEndSession(false);
        resolve();    
    });
}
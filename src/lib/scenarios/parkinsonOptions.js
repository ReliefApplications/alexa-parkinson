const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').ParkinsonOptions;
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
        MemoryHandler.setMemory(new SkillMemory('Help', Locale.options(), {}, undefined, undefined));
        response.say( Locale.options() );
        response.reprompt( Locale.reprompt() );
        response.send();
        response.shouldEndSession(false);
        resolve();
    });
}
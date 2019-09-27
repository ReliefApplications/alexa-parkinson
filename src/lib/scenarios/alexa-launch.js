const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Utils = require('./../../Utils').Utils;
const Constants = require('./../../Constants');
const Locale = require('../locale/es').AlexaLaunch;

/**
 * Start session with a welcome message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
	return new Promise( function (resolve, reject) {;
		response.say( Locale.title() + ' ' + Locale.say() );
		response.reprompt( Locale.reprompt() );

		if ( Utils.supportsDisplay(request) ) {
			response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), Locale.text() ));
		}

		MemoryHandler.setMemory( new SkillMemory('AlexaLaunch', Locale.title() + ' ' + Locale.text(), {}, undefined, undefined ));

		response.send();
		response.shouldEndSession(false);
		resolve();
	});
};
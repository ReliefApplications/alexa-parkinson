const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Utils = require('./../../Utils').Utils;
const Constants = require('./../../Constants');

/**
 * Start session with a welcome message
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
	return new Promise( function (resolve, reject) {
		const msg = Utils.getText(Constants.texts.welcome);
		response.say(msg.title + ' ' + msg.text);
		response.reprompt("Di “Mi Medicación”, “Llamar” o pregúntame “¿Qué puedo hacer?”");

		if ( Utils.supportsDisplay(request) ) {
			response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, msg.title, msg.text));
		}

		MemoryHandler.setMemory(new SkillMemory(
            'AlexaLaunch', msg, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

		response.send();
		response.shouldEndSession(false);
		resolve();
	});
};
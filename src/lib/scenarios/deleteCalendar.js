const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').deleteCalendar;
const LocaleGeneral = require('../locale/es').General;
const UserService = require('./../database/userdata');

/**
 * Display options
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {

        let userId = request.context.System.user.userId

        UserService.deleteCalendar(userId);
        UserService.addNewUserStock(userId);
        UserService.addNewUser(userId);
        response.say(Locale.deleteConfirmation());

        response.reprompt(LocaleGeneral.continue());
        response.send();
        response.shouldEndSession(false);
    

        MemoryHandler.setMemory(new SkillMemory(
            'Help', LocaleGeneral.continue(), {},
            (req, res) => { return require('./parkinsonOptions')(req, res); },
            (req, res) => { return require('./alexa-confirmation')(req, res); }
        ));
        resolve();
    });
}
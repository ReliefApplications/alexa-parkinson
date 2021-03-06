const UserService = require('./../database/userdata');
const SkillMemory = require('./../models/skill-memory');
const RequestHandler = require('./../services/request-handler');
const MemoryHandler = require('./../services/memory-handler');
const Datetime = require('../services/datetime');
const Locale = require('../locale/es').MedicationCalendar;
const LocaleGeneral = require('../locale/es').General;

const skillName = 'MedecineCalendar';

/**
 * Retrun entries in the calendar
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {

    // Define on which moment it should look
    const day = Datetime.pipeDay( RequestHandler.getSlotId(request.slots.day) );
    const moment = RequestHandler.getSlotId(request.slots.day) === 'NOW' ?
        Datetime.getCurrentMomentOfDay(): Datetime.pipeMomentOfDay( RequestHandler.getSlotId(request.slots.momentOfDay) );

    // Get medecines from and say result
    return UserService.getUserMedicines(request.currentUser, day)
    .then( function(calendar) {
        Object.keys(calendar).forEach( moment => {
            calendar[moment] = calendar[moment].map( t => t.quantity + ' ' + t.medicine.product );
            const lastMedicine = calendar[moment].pop();
            calendar[moment] = calendar[moment].join(', ');
            calendar[moment] = calendar[moment] !== '' ? [calendar[moment], lastMedicine].join(', y ') : lastMedicine;
        });

        let message = '';

        if ( moment ) {
            if ( calendar[moment] ) message += Locale.momentMedication(moment, calendar);
            else message += Locale.noMedicationOnMoment(moment);
        } else {
            ['morning', 'afternoon', 'night'].forEach( m => {
                if ( calendar[m] ) message += Locale.momentMedication(m, calendar);
            });
            if ( message === '' ) message += Locale.noMedicationOnDay();
        }

        message += LocaleGeneral.continue();

        MemoryHandler.setMemory(new SkillMemory(
            skillName, message, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.say( message );
        response.reprompt( LocaleGeneral.continue() );
        response.send();
        return response.shouldEndSession(false);
    })
    .catch( function(err) {
        const msg = Locale.error();
        response.say(msg);

        MemoryHandler.setMemory(new SkillMemory(
            skillName, msg, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.reprompt( LocaleGeneral.continue() );
        response.send();
        return response.shouldEndSession(false);
    });
}

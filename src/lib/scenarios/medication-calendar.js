const UserService = require('./../database/userdata');
const SkillMemory = require('./../models/skill-memory');
const RequestHandler = require('./../services/request-handler');
const MemoryHandler = require('./../services/memory-handler');
const Datetime = require('../services/datetime');

/**
 * Retrun entries in the calendar
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {

    let moment, day;
    
    // Define on which moment it should look
    try {
        moment = Datetime.pipeMomentOfDay( RequestHandler.getSlotId(request.slots.momentOfDay) );
        day = Datetime.pipeDay( RequestHandler.getSlotId(request.slots.day) );
    } catch(err) {
        const msg = "No puedo interpretar el día que debe leer. Quiere hacer otra cosa ?";
        response.say(msg);

        MemoryHandler.setMemory(new SkillMemory(
            'MedecineCalendar', msg, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.reprompt('Qué quieres hacer ?');
        response.send();
        return response.shouldEndSession(false);
    }

    // Get medecines from and say result
    return UserService.getUserMedicines(request.currentUser, day, moment)
    .then( function(treatments) {
        const msg = treatments.map( t => t.quantity + ' ' + t.medicine.product ).join(', ');
        const fullmsg = msg.length > 0 ? 'Tienes que tomar ' + msg + '.': 'No tienes nada en el calendario para este momento.'
            
        response.say(fullmsg);
        response.say('\n Quieres hacer algo más ?');
        
        MemoryHandler.setMemory(new SkillMemory(
            'MedecineCalendar', fullmsg, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.reprompt('Comó puedo ayudarte ?');
        response.send();
        return response.shouldEndSession(false);
    })
    .catch( function(err) {
        const msg = 'No puedo leer tu calendario. Te puedo ayudar de alguna otra manera ?';
        response.say(msg);

        MemoryHandler.setMemory(new SkillMemory(
            'MedecineCalendar', msg, {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-stop')(req, res); }
        ));

        response.reprompt('Qué quieres hacer ?');
        response.send();
        return response.shouldEndSession(false);
    });
}

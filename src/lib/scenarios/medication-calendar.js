const dico = require('./../constants/scenario.dictionary');

const UserService = require('./../database/userdata');
const SkillMemory = require('./../models/skill-memory');
const RequestHandler = require('./../services/request-handler');
const MemoryHandler = require('./../services/memory-handler');
const Datetime = require('./../utils/datetime');

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
        response.say(err.message);
        response.send();
        return response.shouldEndSession(false);
    }

    // Get medecines from and say result
    return UserService.getUserMedicines(request.currentUser, day, moment)
    .then( function(treatments) {
        const msg = treatments.map( t => t.quantity + ' ' + t.medicine.product ).join(',');
        const fullmsg = msg.length > 0 ? 'Tienes que tomar ' + msg + '.': 'No tienes nada en el calendario para este momento.'
        
        MemoryHandler.setMemory(new SkillMemory(
            'MedecineCalendar', fullmsg,
            (req, res) => { return dico.help(req, res); },
            (req, res) => { return dico.end(req, res); })
        );
    
        response.say(fullmsg);
        response.say('\n Quieres hacer algo más ?');
        response.send();
        return response.shouldEndSession(false);
    })
    .catch( function(err) {
        response.say('No puedo leer tu calendario. Te puedo ayudar de alguna otra manera ?');
        response.send();
        return response.shouldEndSession(false);
    });
}

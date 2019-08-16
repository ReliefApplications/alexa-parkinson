const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const RequestHandler = require('./../services/request-handler');
const MedicineService = require('./../database/medicinedata');
const UserService = require('./../database/userdata');
const Datetime = require('../services/datetime');

const skillName = 'MedicationInsertion'

/**
 * **Medication Insertion**
 * 
 * Add a medication to the user's calendar
 */
module.exports = {
    insertion: function (request, response) {
        // Get data from intent
        let newTreatment = {
            medicine: request.slots.medicineName.value,
            frequency: request.slots.frequency.value,
            momentOfDay: Datetime.pipeMomentOfDay( RequestHandler.getSlotId(request.slots.momentOfDay) ),
            quantity: parseInt(request.slots.pillNumber.value, 10),
        }
    
        let firstIntensity = request.slots.intensity.value || '';
        let secondIntensity = request.slots.second_intensity.value || '';
    
        // Alexa might misunderstand decimal intensity values, so we need to do a check and refuse the request if it fails.
        if ( (firstIntensity !== '' && Number.isNan(parseInt(firstIntensity))) || (secondIntensity !== '' && Number.isNan(parseInt(secondIntensity))) ) {
            return handleIntensityError(treatment, response);
        }

        newTreatment.medicine = `${newTreatment.medicine} ${firstIntensity} ${secondIntensity}`.trim();
    
        // Try to add the treatment in the schedule
        return tryAddTreatment(request.user, newTreatment, response);
    },
    confirmation: function(request, response) {
        // Check that the hot memory is about a medication insertion. Else, this intent should not be handled here
        if( MemoryHandler.getHotMemory().name !== skillName ) {
            let msg = `Quires que hace una búsqueda sobre "${request.slots.medicineName.value}" ? `;
            response.say(msg)
            response.send();
            // TODO : Handle this kind of request
            MemoryHandler.setMemory( new SkillMemory(skillName, msg, {}, () => {}, () => {}) );
            return response.shouldEndSession(false);
        } 

        // Update the treatment with received data
        const newTreatment = MemoryHandler.getHotMemory().data;

        let firstIntensity = request.slots.firstIntensity.value || '';
        let secondIntensity = request.slots.secondIntensity.value || '';

        // Alexa might misunderstand decimal intensity values, so we need to do a check and refuse the request if it fails.
        if ( (firstIntensity !== '' && Number.isNan(parseInt(firstIntensity))) || (secondIntensity !== '' && Number.isNan(parseInt(secondIntensity))) ) {
            return handleIntensityError(treatment, response);
        }

        newTreatment.medicine = `${request.slots.medicineName.value} ${firstIntensity} ${secondIntensity}`.trim();

        // Try to add the treatment in the schedule
        return tryAddTreatment(request.currentUser, newTreatment, response);
    }
}

/**
 * Send a message to user if can't parse intensity error
 * @param {*} response 
 */
function handleIntensityError(treatment, response) {
    return new Promise( function(resolve, reject) {
        let msg = `No pude traducir la intensidad que me diste. Si la intensidad es un número decimal, como el Mirapex 0.125 mg, dice "Mirapex 0 comma 125 mg".`;
        response.say(msg);
        response.send();
        MemoryHandler.setMemory( new SkillMemory(skillName, msg, treatment) );
        response.shouldEndSession(false);
        resolve()
    });
}

/**
 * Try to add a new treatment into user's calendar
 * @param {*} treatment 
 * @param {*} response 
 */
function tryAddTreatment(user, treatment, response) {
    return MedicineService.getMedicineByFormattedName(treatment.medicine)
    .then(medicines => {
        let msg;
        if ( medicines.length > 1 ) {
            msg = `Tengo mas de un medicamento que se llaman "${treatment.medicine}". Puede ser mas specifico ? `;
            msg += `Por ejamplo, conozco el ${medicines[0].product}, o el ${medicines[1].product}.`.split('/').join(' barra ');
            MemoryHandler.setMemory( new SkillMemory(skillName, msg, treatment) );
        } else if ( medicines.length === 1 ) {
            treatment.medicine = medicines[0];
            UserService.updateUser(buildTreatment(user, treatment));
            msg = `Medicamento añadido a tu calendario ¿Quieres añadir otro? `;
            MemoryHandler.setMemory( new SkillMemory(
                skillName, msg, treatment,
                (req, res) => { return require('./help')(req, res); },
                (req, res) => { return require('./alexa-stop')(req, res); }
            ));
        } else if ( medicines.length === 0 ) {
            msg = `Después de buscar, no pude encontrar un medicamento que se llama "${treatment.medicine}". Puedes reprtir, por favor?`;
            MemoryHandler.setMemory( new SkillMemory(skillName, msg, treatment) );
        }
        response.say(msg);
        response.send();
        return response.shouldEndSession(false);
    });
}

/**
 * Build a proper treatment object to add it in tha database
 * @param {*} user 
 * @param {*} treatment to add to schedule
 */
function buildTreatment(user, treatment) {

    // Build the empty calendar if it wasn't already present
    let calendar = user.calendar !== undefined ? user.calendar : {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {}
    };

    Object.keys(calendar).forEach(day => {
        // Take the list of medicines to take in a certain moment of a certain day
        let medicines = calendar[day][treatment.momentOfDay] || [];

        let isAlreadyThere = medicines.find(medicineInCalendar => {
            // I've got the suspect that they are of ObjectId type,
            // but I can not confirm it
            
            return String(medicineInCalendar.medicine) === String(treatment.medicine._id);
        }) !== undefined;

        if (!isAlreadyThere) {
            medicines.push({medicine: treatment.medicine._id, quantity: treatment.quantity});
            calendar[day][treatment.momentOfDay] = medicines;
        }
    });

    // TODO: do something when there were no new insertions

    user.calendar = calendar;
    return user;
}
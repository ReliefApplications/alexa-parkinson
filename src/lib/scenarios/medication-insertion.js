const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const RequestHandler = require('./../services/request-handler');
const MedicineService = require('./../database/medicinedata');
const UserService = require('./../database/userdata');
const Datetime = require('./../services/datetime');

const skillName = 'MedicationInsertion';

/**
 * **Medication Insertion**
 * 
 * Add a medication to the user's calendar
 */
module.exports = {
    insertion: function (request, response) {
        let newTreatment = {
            medicine: request.slots.medicineName.value,
            frequency: Datetime.pipeFrequency( RequestHandler.getSlotId(request.slots.frequency) ),
            momentOfDay: Datetime.pipeMomentOfDay( RequestHandler.getSlotId(request.slots.momentOfDay) ),
            quantity: parseInt(request.slots.pillNumber.value, 10),
            intensity: RequestHandler.getIntensity(request.slots.intensity),
        }
        return tryAddTreatment(request.currentUser, newTreatment, response);
    },
    confirmation: function(request, response) {
        // Check that the hot memory is about a medication insertion. Else, this intent should not be handled here
        if( !MemoryHandler.getHotMemory() || MemoryHandler.getHotMemory().name !== skillName ) {
            let msg = `Quires que hace una búsqueda sobre "${request.slots.medicineName.value}" ? `;
            response.say(msg);
            response.send();

            MemoryHandler.setMemory( new SkillMemory(skillName, msg, {}, 
                (req, res) => { return require('./medicine-information')(req, res); },
                (req, res) => { return require('./alexa-stop')(req, res); } )
            );
            return response.shouldEndSession(false);
        }
        // Update the treatment with received data
        const newTreatment = MemoryHandler.getHotMemory().data.treatment;
        newTreatment.intensity = RequestHandler.getIntensity(request.slots.intensity);
        newTreatment.medicine = request.slots.medicineName.value;
        // Try to add the treatment in the schedule
        return tryAddTreatment(request.currentUser, newTreatment, response);
    }
}

/**
 * Try to add a new treatment into user's calendar
 * @param {*} treatment 
 * @param {*} response 
 */
function tryAddTreatment(user, treatment, response) {
    return MedicineService.getMedicineByCommercialName(`${treatment.medicine} ${treatment.intensity}`)
    .then(medicines => {
        let msg;
        if ( medicines.length > 1 ) {
            msg = `Tengo mas de un medicamento que se llaman "${treatment.medicine} ${treatment.intensity}". Puede ser mas specifico ? `;
            msg += `Por ejamplo, conozco el ${medicines[0].product}, o el ${medicines[1].product}.`.split('/').join(' barra ');
            MemoryHandler.setMemory( new SkillMemory(skillName, msg, {treatment, medicines: medicines.length}) );
        } else if ( medicines.length === 1 ) {
            treatment.medicine = medicines[0];
            UserService.updateUser(buildTreatment(user, treatment));
            msg = `Medicamento añadido a tu calendario ¿Quieres añadir otro? `;
            MemoryHandler.setMemory( new SkillMemory(
                skillName, msg, {treatment},
                (req, res) => { return require('./help')(req, res); },
                (req, res) => { return require('./alexa-stop')(req, res); }
            ));
        } else if ( medicines.length === 0 ) {
            msg = `Después de buscar, no pude encontrar un medicamento que se llama "${treatment.medicine} ${treatment.intensity}". Dime el nombre de la medication, por favor.`;
            MemoryHandler.setMemory( new SkillMemory(skillName, msg, {treatment}) );
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

    console.log(treatment);

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

    treatment.frequency.forEach( day => {
        let medicines = calendar[day][treatment.momentOfDay] || [];
        if ( !medicines.find(medicineInCalendar => String(medicineInCalendar.medicine) === String(treatment.medicine._id)) ) {
            medicines.push( {medicine: treatment.medicine._id, quantity: treatment.quantity} );
            calendar[day][treatment.momentOfDay] = medicines;
        }
    });

    // TODO: do something when there were no new insertions

    user.calendar = calendar;
    return user;
}
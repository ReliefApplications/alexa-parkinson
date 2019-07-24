
const State = require('../dialogue-tree').trees.State;
const medicineService = require('../../database/medicinedata');
const userService = require('../../database/userdata');
const utils = require('../../../Utils').Utils;

const temporaryMemory = require('../../tempdata/temporary-data');

const FREQUENCY_TYPES = [
    'daily',
    'weekly',
]

/**
 * 
 */
function buildTreatment(user, medicine, frequency, momentOfDay) {

    // Build the empty calendar if it wasn't already present
    let calendar =
        user.calendar !== undefined ? user.calendar : {
            monday: {
                // noche: [] // medicines array
                // manana: []
                // tarde: []
            },
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {}
        };

    // Count how many times we find the medicine into the calendar
    // Useful for future handling of the case in which the insertion is void
    let medicinesFound = 0;

    Object.keys(calendar).forEach(day => {
        // Take the list of medicines to take in a certain moment of a certain day
        let medicines = calendar[day][momentOfDay] || [];

        let isAlreadyThere = medicines.find(medicineInCalendar => {
            // I've got the suspect that they are of ObjectId type,
            // but I can not confirm it
            return String(medicineInCalendar) === String(medicine._id);
        }) !== undefined;

        // If false + 0, if true + 1
        medicinesFound += isAlreadyThere;

        if (!isAlreadyThere) {
            medicines.push(medicine._id);
            calendar[day][momentOfDay] = medicines;
        }
    });

    // TODO do something when there were no new insertions

    user.calendar = calendar;
    return user;
}

function getMedicine(searchName) {
    utils.log("Searching", searchName);
    return medicineService.getMedicineByFormattedName(searchName)
        .then(medicines => {
            return medicines;
        });
}

/**
 * This node will take the medicine and schedule informations and update the user's data
 * according to the informations.
 * If it founds one or more medicines, it will ask for confirmation from the user in the
 * next node.
 */
const treatmentInsertion = new State({
    main: ([slots, user]) => {

        // Delete any possible 'yes' or 'no' said after a previous insertion
        temporaryMemory.removeTemporaryData()

        let medicineName = slots.medicineName.value;
        let frequency = slots.frequency.value;
        let momentOfDay = slots.momentOfDay.value;
        let first_intensity = slots.intensity.value || '';
        let second_intensity = slots.second_intensity.value || '';

        // Quick workaround for the dot (.) problem
        let parsedFirstIntensity = first_intensity.split('.');
        if (parsedFirstIntensity.length > 1 && second_intensity === '') {
            first_intensity = parsedFirstIntensity[0];
            second_intensity = parsedFirstIntensity[1];
        }

        let full_medicine_name = `${medicineName} ${first_intensity} ${second_intensity}`.trim();

        return getMedicine(full_medicine_name)
            .then(medicines => {
                if (medicines.length > 1 || medicines.length === 0) {
                    temporaryMemory.saveTemporaryData(user._id, {
                        medicines: medicines,
                        momentOfDay: momentOfDay,
                        frequency: frequency
                    });
                    throw medicines;
                } else if (medicines.length === 1) {
                    return buildTreatment(user, medicines[0], frequency, momentOfDay);
                }

            });

    },

    yes: ([request, response]) => {
        let alreadySaidNo = temporaryMemory.getTemporaryData("alreadySaidNo");
        if (alreadySaidNo) {
            response.say("¿Quieres información sobre tu medicación o llamar a la asociación?");
            response.shouldEndSession(false);
        } else {
            response.say("Di el nombre del medicamento a añadir al calendario");
            response.shouldEndSession(false);
        }
    },

    no: ([request, response]) => {
        let alreadySaidNo = temporaryMemory.getTemporaryData("alreadySaidNo");
        if (alreadySaidNo) {
            temporaryMemory.removeTemporaryData("alreadySaidNo");
            response.say("Muchas gracias por utilizar la skill Parkinson Alexa, hasta pronto");
            response.shouldEndSession(true);
        } else {
            // TODO implement multi user
            temporaryMemory.saveTemporaryData("alreadySaidNo", true);
            response.say("¿Deseas hacer algo más?");
            response.shouldEndSession(false);
        }
    }

})
    .addChild('medicine-choose-confirmation',

        /**
         * This node is used to confirm a particular medicine when there are
         * too many medicines corresponding to user's input.
         */
        new State({

            main: ([slots, user]) => {
                let medicineName = slots.medicineName.value;
                let firstIntensity = slots.firstIntensity.value;
                let secondIntensity = slots.secondIntensity.value || '';

                let fullMedicineName = `${medicineName} ${firstIntensity} ${secondIntensity}`.trim();

                // Get the data previously stored
                let tempData = temporaryMemory.getTemporaryData(user._id);
                let medicines = tempData.medicines;
                let frequency = tempData.frequency;
                let momentOfDay = tempData.momentOfDay;

                // console.log("Medicines is ", typeof medicines, "Value", medicines);
                utils.log("Full medicine name", fullMedicineName, Buffer.from(fullMedicineName));
                utils.log("Medicines from last call are", medicines.map(x => {
                    return { name: x.formatted_name, buff: Buffer.from(x.formatted_name) }

                }));
                let filteredMedicines = medicines.filter(x => x.formatted_name.startsWith(fullMedicineName));
                utils.log("Filtered medicines", filteredMedicines.map(x => {
                    return { name: x.formatted_name, buff: Buffer.from(x.formatted_name) };
                }));

                if (filteredMedicines.length === 0) {
                    return Promise.reject({ error: "no_medicine_found" });
                } else if (filteredMedicines.length > 1) {
                    return Promise.reject({ error: "too_many_medicines" });
                }
                let updatedUser = buildTreatment(user, filteredMedicines[0], frequency, momentOfDay);
                temporaryMemory.removeTemporaryData(updatedUser._id);
                userService.updateUser(updatedUser);
                return Promise.resolve(updatedUser);
            },

            yes: ([request, response]) => {
                let alreadySaidNo = temporaryMemory.getTemporaryData("alreadySaidNo");
                if (alreadySaidNo) {
                    response.say("¿Quieres información sobre tu medicación o llamar a la asociación?");
                    response.shouldEndSession(false);
                } else {
                    response.say("Di el nombre del medicamento a añadir al calendario");
                    response.shouldEndSession(false);
                }
            },

            no: ([request, response]) => {
                let alreadySaidNo = temporaryMemory.getTemporaryData("alreadySaidNo");
                if (alreadySaidNo) {
                    temporaryMemory.removeTemporaryData("alreadySaidNo");
                    response.say("Muchas gracias por utilizar la skill Parkinson Alexa, hasta pronto");
                    response.shouldEndSession(true);
                } else {
                    // TODO implement multi user
                    temporaryMemory.saveTemporaryData("alreadySaidNo", true);
                    response.say("¿Deseas hacer algo más?");
                    response.shouldEndSession(false);
                }
            }
        })
    );


module.exports.treatmentInsertion = treatmentInsertion;

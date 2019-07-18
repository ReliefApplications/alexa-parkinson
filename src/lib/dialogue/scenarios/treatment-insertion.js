/**
 * BUONGIORNO.
 * 
 * Cosa fare oggi:
 * 
 * 2) Testare la seguente conversazione
 * 
 * tengo que tomar carbidopa levodopa genérica cada dia la noche
 *
 * carbidopa levodopa genérica 25 100
 * 
 * 3) Se i test hanno successo, scrivere qualcosa sul README per il settaggio del database e la formattazione dei dati
 */
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
    let days =
        user.calendar !== undefined ? user.calendar : {
            monday: [
                {medicine: 10, moment: "noche"}
            ],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };

    Object.keys(days).forEach(day => {
        // Take the 'moments' array if exists,
        // Create it if it doesn't
        // the array holds the moments of the day in which a user should take
        // the medicine
        let moments = days[day].moments || [];
        moments.push(momentOfDay);
        utils.log("Medicine in buildTreatment", medicine);
        days[day].push({
            medicine: medicine._id, // <- medicine ID
            moments: moments
        });
    });

    user.calendar = days;
    return user;
}

function getMedicine(searchName) {
    utils.log("Searching", searchName);
    return medicineService.getMedicineByFormattedName(searchName)
        .then(medicines => {
            utils.log("GOT MEDICINE(S)", medicines);
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

        let medicineName = slots.medicineName.value;
        let frequency = slots.frequency.value;
        let momentOfDay = slots.momentOfDay.value;
        let first_intensity = slots.intensity.value || '';
        let second_intensity = slots.second_intensity.value || '';

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
            }
        })
    );


module.exports.treatmentInsertion = treatmentInsertion;

const State = require('../dialogue-tree').trees.State;
const medicineService = require('../../database/medicinedata');
const utils = require('../../../Utils').Utils;

const temporaryMemory = require('../../tempdata/temporary-data');

const FREQUENCY_TYPES = [
    'daily',
    'weekly',
]

const lastMedicines = {
    // userId: Array<Medicine>
}

function buildTreatment(user, medicineName, frequency, momentOfDay) {


    // Build the empty calendar if it wasn't already present
    let days =
        user.calendar !== undefined ? user.calendar : {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };


    return getMedicine(medicineName)
        .then(medicines => {
            if (medicines.length > 1) {
                // Save the list of medicines to get it later
                lastMedicines[user._id] = medicines;
                temporaryMemory.saveTemporaryData(user._id, { medicines: medicines })
                // Throw the medicines as error so to have them into the .catch in index.js
                // Today I thought about a reason to NOT throw them, but I don't remember it.
                throw medicines;
            }

            Object.keys(days).forEach(day => {
                // Take the 'moments' array if exists,
                // Create it if it doesn't
                // the array holds the moments of the day in which a user should take
                // the medicine
                let moments = days[day].moments || [];
                moments.push(momentOfDay);

                days[day].push({
                    medicine: medicineName, // <- medicine ID
                    moments: moments
                });

            });

            user.calendar = days;
            return [user, medicines];
        });

}

function getMedicine(searchName) {
    utils.log("Searching", searchName);
    return new Promise(async (resolve, reject) => {
        let medicines = await medicineService.getMedicineByFormattedName(searchName);
        utils.log("GOT MEDICINE(S)", medicines);
        resolve(medicines);
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

        console.log("SLOTS");

        console.table(slots);

        let medicineName = slots.medicineName.value;
        let frequency = slots.frequency.value;
        let momentOfDay = slots.momentOfDay.value;
        let first_intensity = slots.intensity.value || '';
        let second_intensity = slots.second_intensity.value || '';

        let full_medicine_name = `${medicineName} ${first_intensity} ${second_intensity}`.trim();

        let treatment = buildTreatment(user, full_medicine_name, frequency, momentOfDay)
            .then( ([user, medicines]) => {
                
                if (medicines.length > 1) {
                    temporaryMemory.saveTemporaryData(user._id, {
                        medicines: medicines,
                        momentOfDay: momentOfDay,
                        frequency: frequency
                    });
                }

                return user;
            });

        return treatment;
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
                let secondIntesity = slots.secondIntesity.value || '';

                let fullMedicineName = `${medicineName} ${firstIntensity} ${secondIntesity}`.trim();
                let medicines = lastMedicines[user._id].medicines;

                utils.log("Medicines from last call are", medicines);
            }
        })
    );


module.exports.treatmentInsertion = treatmentInsertion;

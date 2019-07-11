const State = require('../dialogue-tree').trees.State;
const medicineService = require('../../database/medicinedata');
const utils = require('../../../Utils').Utils;

const FREQUENCY_TYPES = [
    'daily',
    'weekly',
]

const lastMedicines = {
    // userId: Array<Medicine>
}

function buildTreatment(user, medicineName, frequency, momentOfDay) {

    /**
     * Build the empty calendar if it wasn't already present
     */
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
        .then(medicine => {
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
            return user;
        });

}

function getMedicine(searchName) {
    utils.log("Searching", searchName);
    return new Promise(async (resolve, reject) => {
        let medicines = await medicineService.getMedicineByFormattedName(searchName);

        if (medicines.length > 1) {
            // lastMedicines[user._id] = medicines;
            // throw here to have it into the .catch
            reject(medicines);
            
        } else {
            utils.log("Found one medicine!");
            utils.log(medicines);
            resolve(medicines);
        }
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

        let treatment = buildTreatment(user, full_medicine_name, frequency, momentOfDay);
        return treatment;
    }

}).addChild('medicine-choose-confirmation',

    new State({

        main: ([slots, user]) => {

        }
    })
);


module.exports.treatmentInsertion = treatmentInsertion;

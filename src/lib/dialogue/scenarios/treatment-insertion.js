const State = require('../dialogue-tree').trees.State;
const medicineService = require('../../database/medicinedata');

const FREQUENCY_TYPES = [
    'daily',
    'weekly',
]

const lastMedicines = {
    // userId: Array<Medicine>
}

let buildTreatment = function (user, medicineName, frequency, momentOfDay) {

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

    return new Promise(async (resolve, reject) => {
        let medicines = await medicineService.getMedicineByFormattedName(searchName);
        
        if (medicines.length > 1) {
            console.log("More than one");
            console.log(medicines);
            // lastMedicines[user._id] = medicines;
            // throw here to have it into the .catch
            reject(medicines);
        }

        resolve(medicines[0]);
    });
}

const treatmentInsertion = new State({
    main: ([slots, user]) => {
        // return new Promise(async (resolve, reject) => {

        let medicineName = slots.medicineName.value;
        let frequency = slots.frequency.value;
        let momentOfDay = slots.momentOfDay.value;
        let first_intensity = slots.intensity.value || '';
        let second_intensity = slots.second_intensity.value || '';

        console.log(first_intensity);
        console.log(second_intensity);

        let full_medicine_name = `${medicineName} ${first_intensity}  ${second_intensity}`.trim();

        console.log("FULL MEDICINE NAME IS ", full_medicine_name)
        let treatment = buildTreatment(user, full_medicine_name, frequency, momentOfDay);
        // resolve(treatment);
        return treatment;
        // });
    }
});


const treatmentConfirmation = new State({
    main: ([slots, user]) => {

    }
});
module.exports.treatmentInsertion = treatmentInsertion;

const State = require('../dialogue-tree').trees.State;
const medicineService = require('../../database/medicinedata');

const FREQUENCY_TYPES = [
    'daily',
    'weekly',
]

let buildTreatment = function(user, medicineName, frequency, momentOfDay) {

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

        Object.keys(days).forEach(day => {
            
            // Take the 'moments' array if exists,
            // Create it if it doesn't
            let moments = days[day].moments || [];
            moments.push(momentOfDay);
            
            days[day].push({
                medicine: medicineName,
                moments: moments
            });
            
        });
    // }
    
    user.calendar = days;
    console.log(days);
    console.log(user);
    console.log(user.calendar.wednesday);

    return user;
}

module.exports.getMedicine = function(searchName) {
    return medicineService.getMedicineByCommercialName('sinemet')
        .then(medicines => {
            
            let splittedSearchName = searchName.split(' ');

            console.log("Almost into filter");
            console.log(medicines);
            
            return medicines
                .filter(element => {
                    console.log("Almost into reduce");
                    let included = splittedSearchName.reduce( (previous, current) => {
                        console.log(`Does ${element.product} includes ${current} ?`)
                        /**
                         * TODO: FIND TE PERFECT REGULAR EXPRESSION
                         */
                        let res = new RegExp(`(\\s/)*${current}(\\s/)*`,"i").test(element.product);
                        console.log(res);
                        return previous && res;

                    }, false);
                    return included;
                });
        });
}

const treatmentInsertion = new State({
    main: ([slots, user]) => {
        return new Promise( (resolve, reject) => {
            // let personName = slots.name.value;
            let medicineName = slots.medicineName.value;
            let frequency = slots.frequency.value;
            let momentOfDay = slots.momentOfDay.value;
            let treatment = buildTreatment(user, medicineName, frequency, momentOfDay);
            resolve(treatment);
        });
    }
});

module.exports.treatmentInsertion = treatmentInsertion;

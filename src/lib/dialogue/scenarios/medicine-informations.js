const medicineService = require('../../database/medicinedata');
const states = require('../dialogue-tree').trees;
const utils = require('../../../Utils').Utils;

const slotToDbColumnMap = {
    forma: 'shape',
    color: 'color',
    efectos_secundarios: 'side_effects'
}

const medicineInfoIntent = new states.State({

    main: async function ([slots]) {

        return new Promise(async (resolve, reject) => {
            let info = slots.medicineInformation.value.replace(' ', '_');
            if (!Object.keys(slotToDbColumnMap).includes(info)) {
                reject(`${info} is not into the mapping object`);
            }
            // console.log("RAW INFO", info);
            
            
            info = slotToDbColumnMap[info.replace(' ', '_')];
            
            // let name = slots.medicineBrandName.value;
            let name = `${slots.medicineBrandName.value} ${slots.intensity.value || ''} ${slots.secondIntensity.value || ''}`.trim();
            utils.log("Full name is ", name);
            // If there is the "medicineInformation" slot, then replace the whitespaces with underscores,
            // otherwise take the side effects
            // let formattedInfo = info !== undefined ? info.replace(' ', '_') : 'efectos_secundarios';
            let medicineResult = await medicineService.getMedicineByFormattedName(name);
            medicineResult = medicineResult.slice(0, 3);
            utils.log("List of medicines", medicineResult);
            // The results number can be greater than 1, so let's check
            if (medicineResult.length > 1) {
                // try {
                medicineResult = medicineResult.map(x => x[info]);
                // console.log("MAPPED MEDICINES", medicineResult);
                let resultLength = medicineResult.length;
                // console.log("BEFORE SLICE TRICK");

                // Produces a string similar to "medicine1, medicine2, medicine3, ... y medicine n"
                let listOfMedicines = medicineResult.slice(0, resultLength - 1).join(',')
                    + " y " + medicineResult.slice(resultLength - 1);

                // console.log("Before resolve. L.O.M", listOfMedicines);
                let out = "Tengo mas de 1 medicamentos con ese nombre. " + listOfMedicines;
                

                /**
                 * Ask if the user wanted the first medicine.
                 * If yes, say the side effects,
                 * if not, say the list of medicines.
                 */


                resolve({
                    speak: out
                });

            } else if (medicineResult.length === 1) {
                // console.log("FOUND ONE!", medicineResult);
                resolve({
                    // TODO: change the column name into the database
                    speak: "Los efectos secundarios son " + medicineResult[0].side_effects
                });

            } else {
                resolve({
                    speak: "no existe ninguna medicina con ese nombre"
                });
            }
        });

    },

    yes: (request, response) => { response.shouldEndSession(false); },

    no: (request, response) => { response.shouldEndSession(false); },

    didNotUnderstand: (request, response) => { response.shouldEndSession(false); }
});


module.exports.medicineInfoIntent = medicineInfoIntent;
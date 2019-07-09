const medicineService = require('../../database/medicinedata');
const states = require('../dialogue-tree').trees;

const slotToDbColumnMap = {
    forma: 'shape',
    color: 'color',
    efectos_secundarios: 'side_effects'
}

const medicineInfoIntent = new states.State({

    main: async function ([slots]) {
        return new Promise(async (resolve, reject) => {
            let info = slots.medicineInformation.value;
            if (!Object.keys(slotToDbColumnMap).includes(info)) {
                reject();
            }
            // console.log("RAW INFO", info);


            info = slotToDbColumnMap[info.replace(' ', '_')];

            let name = slots.medicineBrandName.value;
            // If there is the "medicineInformation" slot, then replace the whitespaces with underscores,
            // otherwise take the side effects
            // let formattedInfo = info !== undefined ? info.replace(' ', '_') : 'efectos_secundarios';
            // The results number can be greater than 1, so let's check
            // console.log("INFO: ", info);
            let medicineResult = await medicineService.getMedicineByCommercialName(name);
            // console.log("Got medicine result", medicineResult);
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
                // console.log(out);

                resolve({
                    speak: out
                });
                // } catch (err) {
                // console.log("ERROR", err);
                // reject(err);
                // }

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
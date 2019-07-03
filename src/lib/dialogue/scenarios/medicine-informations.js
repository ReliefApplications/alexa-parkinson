const medicineService = require('../../database/medicinedata');
const states = require('../dialogue-tree').trees;

const slotToDbColumnMap = {
    forma: 'shape',
    color: 'color',
    efectos_secundarios: 'side_effects'
}

const medicineInfoIntent = new states.State(

    async function ([slots]) {
        return new Promise((resolve, reject) => {
            let info = slots.medicineInformation.value;
            if (!Object.keys(slotToDbColumnMap).includes(info)) {
                reject();
            }
            info = slotToDbColumnMap[info];

            let name = slots.medicineBrandName.value;
            // If there is the "medicineInformation" slot, then replace the whitespaces with underscores,
            // otherwise take the side effects
            // let formattedInfo = info !== undefined ? info.replace(' ', '_') : 'efectos_secundarios';
            // The results number can be greater than 1, so let's check
            console.log(info);
            let medicineResult = await medicineService.getMedicineByCommercialName(name);

            if (medicineResult.length > 1) {
                try {
                    medicineResult = medicineResult.map(x => x[info]);
                    let resultLength = medicineResult.length;
                    // Produces a string similar to "medicine1, medicine2, medicine3, ... y medicine n"
                    let listOfMedicines = medicineResult.slice(0, resultLength - 1).join(',')
                        + " y " + medicineResult.slice(resultLength - 1);

                    resolve({
                        speak: "Tengo mas de 1 medicamentos con ese nombre. " + listOfMedicines
                    });
                } catch (err) {
                    console.error(err);
                }

            } else if (medicineResult.length === 1) {
                console.log(medcine)
                resolve({
                    speak: "Los efectos secundarios son " + medicineResult[0].side_effects
                });

            } else {
                resolve({
                    speak: "no existe ninguna medicina con ese nombre"
                });
            }
        });

    },

    (request, response) => { response.shouldEndSession(false); },

    (request, response) => { response.shouldEndSession(false); },

    (request, response) => { response.shouldEndSession(false); }
);


module.exports.medicineInfoIntent = medicineInfoIntent;
const medicineService = require('../../database/medicinedata');
const states = require('../dialogue-tree').trees;
const utils = require('../../../Utils').Utils;

const tempData = require('../../tempdata/temporary-data')

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
                let firstMedicine = medicineResult[0];

                medicineResult = medicineResult.map(x => x[info]);
                let resultLength = medicineResult.length;

                /**
                 * Ask if the user wanted the first medicine.
                 * If yes, say the side effects,
                 * if not, say the list of medicines.
                 */

                // let firstMedicine = medicine.slice(0, 1)[0];

                let out = `Tengo mas de 1 medicamento con ese nombre. Querìas decir ${firstMedicine.product}?`;

                tempData.saveTemporaryData(`medicineForInfo`, {
                    medicine: firstMedicine,
                    info: info
                });


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

    yes: ([request, response]) => {

        let savedData = tempData.getTemporaryData('medicineForInfo');
        let medicine = savedData.medicine;
        let info = savedData.info;

        response.say(medicine[info]);
        response.shouldEndSession(false);

    },

    no: (request, response) => { response.shouldEndSession(false); },

    didNotUnderstand: (request, response) => { response.shouldEndSession(false); }
});


module.exports.medicineInfoIntent = medicineInfoIntent;
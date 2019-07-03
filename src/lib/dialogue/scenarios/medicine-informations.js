const medicineService = require('../../database/medicinedata');
const states = require('../dialogue-tree').trees;

const slotToDbColumnMap = {
    forma: 'shape',
    color: 'color',
    efectos_secundarios: 'side_effects'
}

const medicineInfoIntent = new states.State(
    
    function([slots]) {
        let info = slots.medicineInformation;
        let name = slots.medicineBrandName;
        // If there is the "medicineInformation" slot, then replace the whitespaces with underscores,
        // otherwise take the side effects
        let formattedInfo = info !== undefined ? info.replace(' ', '_') : 'efectos_secundarios';

        // The results number can be greater than 1, so let's check
        const medicineResult = medicineService.getMedicineByCommercialName(name);

        if (medicineResult.length > 1) {
            return {
                speak: "Tengo mas de 1 medicamentos con ese nombre"
            }
        } else if (medicineResult.length === 1) {
            return {
                speak: "Los efectos secundarios son " + medicineResult[0].side_effects
            }
        }
        return name + " puede causar " + medicine[formattedInfo];

    },

    (request, response) => {response.shouldEndSession(false);},
    
    (request, response) => {response.shouldEndSession(false);},

    (request, response) => {response.shouldEndSession(false);}
);


module.exports.medicineInfoIntent = medicineInfoIntent;
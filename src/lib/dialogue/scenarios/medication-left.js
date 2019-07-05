
const state = require('../dialogue-tree').trees;

const constants = require('../../../Constants').Constants;


const left = new state.State({
    main: ([request, response]) => {
        let medicineSlotRaw = request.slots.medicine.resolution(0) ?
            request.slots.medicine.resolution(0).first().name.toLowerCase() : undefined;

        let speechOutput = 'Lo siento';
        let amountLeftResult = '';

        let itemsToDisplay = [];

            if (!medicineSlotRaw || (medicineSlotRaw === 'medicamentos')) {
                let generalResult = Utils.getAllAmounts();
                amountLeftResult = 'Te quedan';

                generalResult.forEach((element, index) => {
                    let amount = Utils.getSingleAmount(element);
                    amountLeftResult += ` ${amount} de ${element.medicine}`;
                    itemsToDisplay.push({ "medicine": element.medicine, "quantity": amount });
                    if (index < generalResult.length - 1) {
                        amountLeftResult += ' y';
                    }
                });
            } else {
                let specificResult = Utils.getSpecificAmount(medicineSlotRaw);
                if (!specificResult) {
                    amountLeftResult = `No te quedas ${medicineSlotRaw}`;
                } else {
                    amountLeftResult = `Te quedas ${specificResult} de ${medicineSlotRaw}`;
                    itemsToDisplay.push({ "medicine": medicineSlotRaw, "quantity": specificResult });
                }
            }

            speechOutput = amountLeftResult;

            return {
                text: amountLeftResult,
                // title: constants.TEXTS.
                title: "Medicine left", // 
                image: undefined,
                shouldEnd: false
            };
    }
});

module.exports.medicationsLeftIntent = left;
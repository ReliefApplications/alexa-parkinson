
const State = require('../dialogue-tree').trees.State;

const Constants = require('../../../Constants');
const Utils = require('../../../Utils').Utils;

const calendar = new State({
    main: ([request, response]) => {
        // let request = params[0];
        // let response = params[1];
        let medicineSlotRaw = request.slots.medicine.resolution(0) ?
            request.slots.medicine.resolution(0).first().name.toLowerCase() : undefined;

        let daySlotRaw = request.slots.day.resolution(0) ?
            request.slots.day.resolution(0).first().name.toLowerCase() : undefined;

        let timeSlotRaw = request.slots.time.resolution(0) ?
            request.slots.time.resolution(0).first().name.toLowerCase() : undefined;

        let speechOutput = 'Lo siento, no hay datos';
        let medicineResult = '';

        let daySlotFormatted = daySlotRaw ? daySlotRaw : 'hoy';
        let timeSlotFormatted = timeSlotRaw;

        let itemsToDisplay = [];

        switch (timeSlotRaw) {
            case 'mañana':
                timeSlotFormatted = 'por la ' + timeSlotRaw;
                break;
            case 'mediodía':
                timeSlotFormatted = 'al ' + timeSlotRaw;
                break;
            case 'noche':
                timeSlotFormatted = 'por la ' + timeSlotRaw;
                break;
        }
        if (!medicineSlotRaw || (medicineSlotRaw === 'medicamentos')) {
            let generalResult = Utils.getGeneralData(Utils.getDayOfWeek(daySlotRaw), Utils.getTimeOfDay(timeSlotRaw));
            medicineResult = 'Debes tomar';
            generalResult.forEach((element, index) => {
                medicineResult += ` ${element['cantidad']} de ${element['medicamento']}`;
                itemsToDisplay.push({ "medicine": element.cantidad, "quantity": element.medicamento });
                if (index < generalResult.length - 1) {
                    medicineResult += ' y';
                }
            });
        } else {
            let specificResult = Utils.getSpecificData(medicineSlotRaw, Utils.getDayOfWeek(daySlotRaw), Utils.getTimeOfDay(timeSlotRaw));
            if (!specificResult) {
                medicineResult = `No tienes que tomar ${medicineSlotRaw}`;
            } else {
                medicineResult = `Debes tomar ${specificResult} de ${medicineSlotRaw}`;
                itemsToDisplay.push({ "medicine": medicineSlotRaw, "quantity": specificResult });
            }
        }

        speechOutput = medicineResult + ' ' + daySlotFormatted + ' ' + timeSlotFormatted;

        return {
            text: speechOutput,
            title: 'Medicaciones',
            image: undefined, // use default for now
            shouldEnd: false
        };
    }
});

module.exports.medicationCalendarIntent = calendar;
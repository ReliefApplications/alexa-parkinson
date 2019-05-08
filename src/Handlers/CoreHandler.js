const Constants = require('../Constants').Constants;
const Utils = require('../Utils').Utils;

exports.CoreHandler = {
    'LaunchRequest':
        // This is triggered when the user says: 'Open parkison skill'
        function (request, response) {
            response.say(Constants.TEXTS.welcomeTitle + ' ' + Constants.TEXTS.welcomeText);
            response.reprompt(Constants.TEXTS.welcomeReprompt);
            response.card(Constants.TEXTS.welcomeTitle, Constants.TEXTS.welcomeText);
            response.shouldEndSession(false);
            return response;
        }
    ,
    'MedicationCalendar':
        // This is triggered when a user ask for information about his medication calendar
        function (request, response) {
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

            return new Promise((resolve) => {
                if (!medicineSlotRaw || (medicineSlotRaw === 'medicinas' || medicineSlotRaw === 'medicamentos')) {
                    let generalResult = Utils.getGeneralData(Utils.getDayOfWeek(daySlotRaw), Utils.getTimeOfDay(timeSlotRaw));
                    medicineResult = 'Debes tomar';
                    generalResult.forEach((element, index) => {
                        medicineResult += ` ${element['cantidad']} de ${element['medicamento']}`;
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
                    }
                }

                speechOutput = medicineResult + ' ' + daySlotFormatted + ' ' + timeSlotFormatted;

                resolve(speechOutput);
            })
                .then(
                    (result) => {
                        response.say(result);
                        response.reprompt(result);
                        response.card('Medicamentos que tomar', result);
                        response.shouldEndSession(false);
                        return response;
                    },
                    (error) => {
                        console.log('error', error);
                        speechOutput = 'Lo siento, hubo un problema con la solicitud';
                        response.say(speechOutput);
                        response.reprompt(speechOutput);
                        response.card('Error!', speechOutput);
                        response.shouldEndSession(true);
                    });
        },
    'MedicationLeft':
        // This is triggered when a user ask for information about his medication calendar
        function (request, response) {
            let medicineSlotRaw = request.slots.medicine.resolution(0) ?
                request.slots.medicine.resolution(0).first().name.toLowerCase() : undefined;

            let speechOutput = 'Lo siento';
            let amountLeftResult = '';

            return new Promise((resolve, reject) => {
                if (!medicineSlotRaw || (medicineSlotRaw === 'medicinas' || medicineSlotRaw === 'medicamentos')) {
                    let generalResult = Utils.getAllAmounts();
                    amountLeftResult = 'Te quedan';

                    generalResult.forEach((element, index) => {
                        amountLeftResult += ` ${Utils.getSingleAmount(element)} de ${element.medicine}`;
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
                    }
                }

                speechOutput = amountLeftResult;

                resolve(speechOutput);
            })
                .then((result) => {
                    response.say(result);
                    response.reprompt(result);
                    response.card('Medicamentos ', result);
                    response.shouldEndSession(false);
                    return response;
                },
                    (error) => {
                        speechOutput = 'Lo siento, hubo un problema con la solicitud';
                        response.say(speechOutput);
                        response.reprompt(speechOutput);
                        response.card('Error!', speechOutput);
                        response.shouldEndSession(false);
                    });
        }
};

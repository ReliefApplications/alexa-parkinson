const Constants = require('../Constants');
const Utils = require('../Utils').Utils;

exports.CoreHandler = {
    'LaunchRequest':
        // This is triggered when the user says: 'Open parkison' or 'Abre parkinson' 
        function (request, response) {

            let welcomeText = Utils.getText(Constants.texts.welcome);

            Utils.setDialogState(request, 'launch');

            response.say(welcomeText.title + ' ' + welcomeText.text);
            response.reprompt(welcomeText.reprompt)
            if (Utils.supportsDisplay(request)) {
                response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, welcomeText.title, welcomeText.text));
            }
            response.shouldEndSession(false);
            
        },
    'MyMedication':
        // This is triggered when the user says: 'Mi medicación' or 'Medicación'
        function (request, response) {
            Utils.setDialogState(request, 'myMedication');
            response.say(Constants.texts.myMedicationText);
            response.reprompt(Constants.texts.myMedicationReprompt);
            if (Utils.supportsDisplay(request)) {
                response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, Constants.texts.myMedicationTitle, Constants.texts.myMedicationText));
            }
            response.shouldEndSession(false);
            return response;
        },
    'Call':
        // This is triggered when the user says: 'Llamar'
        function (request, response) {
            Utils.setDialogState(request, 'call');
            response.say(Constants.texts.callText);
            response.reprompt(Constants.texts.callReprompt);
            if (Utils.supportsDisplay(request)) {
                response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, Constants.texts.callTitle, Constants.texts.callText));
            }
            response.shouldEndSession(false);
            return response;
        }
    ,
    'MedicationCalendar':
        // This is triggered when a user ask for information about his medication calendar
        function (request, response) {

            Utils.setDialogState(request, 'medicationSchedule');

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

            return new Promise((resolve) => {
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

                resolve(speechOutput);
            })
                .then(
                    (result) => {
                        response.say(result);
                        response.reprompt(result);
                        if (Utils.supportsDisplay(request)) {
                            if (itemsToDisplay.length > 0) {
                                response.directive(Utils.renderListTemplate(Constants.images.defaultImage, 'Medicamentos que tomar', itemsToDisplay));
                            } else {
                                response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, 'Medicamentos que tomar', result));
                            }
                        }
                        response.shouldEndSession(false);
                        return response;
                    },
                    (error) => {
                        speechOutput = 'Lo siento, hubo un problema con la solicitud';
                        response.say(speechOutput);
                        response.reprompt(speechOutput);
                        if (Utils.supportsDisplay(request)) {
                            response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, 'Error!', speechOutput));
                        }
                        response.shouldEndSession(true);
                    });
        },
    'MedicationLeft':
        // This is triggered when a user ask for information about his medication calendar
        function (request, response) {

            Utils.setDialogState(request, 'medicationLeft');

            let medicineSlotRaw = request.slots.medicine.resolution(0) ?
                request.slots.medicine.resolution(0).first().name.toLowerCase() : undefined;

            let speechOutput = 'Lo siento';
            let amountLeftResult = '';

            let itemsToDisplay = [];

            return new Promise((resolve, reject) => {
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

                resolve(speechOutput);
            })
                .then((result) => {
                    response.say(result);
                    response.reprompt(result);
                    if (Utils.supportsDisplay(request)) {
                        if (itemsToDisplay.length > 0) {
                            response.directive(Utils.renderListTemplate(Constants.images.defaultImage, 'Medicamentos', itemsToDisplay));
                        } else {
                            response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, 'Medicamentos', result));
                        }
                    }
                    response.shouldEndSession(false);
                    return response;
                },
                    (error) => {
                        speechOutput = 'Lo siento, hubo un problema con la solicitud';
                        response.say(speechOutput);
                        response.reprompt(speechOutput);
                        if (Utils.supportsDisplay(request)) {
                            response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, 'Error!', speechOutput));
                        }
                        response.shouldEndSession(false);
                    });
        },
    'DidNotUnderstand':
        // This is triggered when Alexa can't handle request
        function (request, response) {
            let session = request.getSession();
            dialogState = session.get('dialogState');
            let speechOutput = Constants.texts.unhandledDefaultText + ' ';
            let endSession = false;

            switch (dialogState) {
                //--- lauch ---
                case "launch":
                    session.set('dialogState', 'launchLoopBack1');
                    speechOutput += Constants.texts.unhandledLaunchText1;
                    endSession = false;
                    break;
                case "launchLoopBack1":
                    session.set('dialogState', 'launchLoopBack2');
                    speechOutput += Constants.texts.unhandledLaunchText2;
                    endSession = false;
                    break;
                case "launchLoopBack2":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.texts.unhandledClose;
                    endSession = true;
                    break;

                //--- my medication ---
                case "myMedication":
                    session.set('dialogState', 'myMedicationLoopBack');
                    speechOutput += Constants.texts.unhandledMyMedicationText;
                    endSession = false;
                    break;
                case "myMedicationLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.texts.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationSchedule ---
                case "medicationSchedule":
                    session.set('dialogState', 'medicationScheduleLoopBack');
                    speechOutput += Constants.texts.unhandledMedicationScheduleText;
                    endSession = false;
                    break;
                case "medicationScheduleLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.texts.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationLeft ---
                case "medicationLeft":
                    session.set('dialogState', 'medicationLeftLoopBack');
                    speechOutput += Constants.texts.unhandledMedicationLeftText;
                    endSession = false;
                    break;
                case "medicationLeftLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.texts.unhandledClose;
                    endSession = true;
                    break;

                //--- call ---
                case "call":
                    session.set('dialogState', 'callLoopBack');
                    speechOutput += Constants.texts.unhandledCallText;
                    endSession = false;
                    break;
                case "callLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.texts.unhandledClose;
                    endSession = true;
                    break;

                default:
                    speechOutput = Constants.texts.unhandledDefaultText;
                    endSession = false;
            }
            response.say(speechOutput);
            //response.reprompt(Constants.TEXTS.unhandledReprompt);
            if (Utils.supportsDisplay(request)) {
                response.directive(Utils.renderBodyTemplate(Constants.images.defaultImage, Constants.texts.unhandledTitle, speechOutput));
            }
            response.shouldEndSession(endSession);

            return response;
        }
};

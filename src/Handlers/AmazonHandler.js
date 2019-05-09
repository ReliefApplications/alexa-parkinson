const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;

exports.AmazonHandler = {
    FallbackIntent:
        function (request, response) {
            let speechOutput = 'Lo siento, no te he entendido.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
    ,
    HelpIntent:
        function (request, response) {
            let speechOutput = 'Intente preguntar cuantas medicinas debes tomar. Tambien puedes quitar, diciendo stop.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
    ,
    CancelIntent:
        function (request, response) {
            let speechOutput = 'Hasta pronto. Si quieres volver a utilizar esta función di “Parkinson”';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(true);
            return response;
        }
    ,
    StopIntent:
        function (request, response) {
            let speechOutput = 'Hasta pronto. Si quieres volver a utilizar esta función di “Parkinson”';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(true);
            return response;
        }
    ,
    // repetition logic, got to change
    RepeatIntent:
        function (request, response) {
            let speechOutput = 'Pronto repetiré.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
    ,
    // see dialog delegate
    // Yes answer
    YesIntent:
        function (request, response) {
            let session = request.getSession();
            dialogState = session.get('dialogState');
            let speechOutput = "";
            let endSession = false;

            switch (dialogState) {
                //--- lauch ---
                case "launch":
                    session.set('dialogState', 'launchLoopBack1');
                    speechOutput += Constants.TEXTS.unhandledLaunchText1;
                    endSession = false;
                    break;
                case "launchLoopBack1":
                    session.set('dialogState', 'launchLoopBack2');
                    speechOutput += Constants.TEXTS.unhandledLaunchText2;
                    endSession = false;
                    break;
                case "launchLoopBack2":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- my medication ---
                case "myMedication":
                    session.set('dialogState', 'myMedicationLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMyMedicationText;
                    endSession = false;
                    break;
                case "myMedicationLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationSchedule ---
                case "medicationSchedule":
                    session.set('dialogState', 'medicationScheduleLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMedicationScheduleText;
                    endSession = false;
                    break;
                case "medicationScheduleLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationLeft ---
                case "medicationLeft":
                    session.set('dialogState', 'medicationLeftLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMedicationLeftText;
                    endSession = false;
                    break;
                case "medicationLeftLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- call ---
                case "call":
                    session.set('dialogState', 'callLoopBack');
                    speechOutput += Constants.TEXTS.unhandledCallText;
                    endSession = false;
                    break;
                case "callLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                default:
                    speechOutput = Constants.TEXTS.unhandledDefaultText;
                    endSession = false;
            }

            response.say(speechOutput);
            response.shouldEndSession(false);
            return response;
        },
    // No answer
    NoIntent:
        function (request, response) {

            let session = request.getSession();
            dialogState = session.get('dialogState');
            let speechOutput = "";
            let endSession = false;

            switch (dialogState) {
                //--- lauch ---
                case "launch":
                    session.set('dialogState', 'launchLoopBack1');
                    speechOutput += Constants.TEXTS.unhandledLaunchText1;
                    endSession = false;
                    break;
                case "launchLoopBack1":
                    session.set('dialogState', 'launchLoopBack2');
                    speechOutput += Constants.TEXTS.unhandledLaunchText2;
                    endSession = false;
                    break;
                case "launchLoopBack2":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- my medication ---
                case "myMedication":
                    session.set('dialogState', 'myMedicationLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMyMedicationText;
                    endSession = false;
                    break;
                case "myMedicationLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationSchedule ---
                case "medicationSchedule":
                    session.set('dialogState', 'medicationScheduleLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMedicationScheduleText;
                    endSession = false;
                    break;
                case "medicationScheduleLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationLeft ---
                case "medicationLeft":
                    session.set('dialogState', 'medicationLeftLoopBack');
                    speechOutput += Constants.TEXTS.unhandledMedicationLeftText;
                    endSession = false;
                    break;
                case "medicationLeftLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- call ---
                case "call":
                    session.set('dialogState', 'callLoopBack');
                    speechOutput += Constants.TEXTS.unhandledCallText;
                    endSession = false;
                    break;
                case "callLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                default:
                    speechOutput = Constants.TEXTS.unhandledDefaultText;
                    endSession = false;
            }

            response.say(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
};

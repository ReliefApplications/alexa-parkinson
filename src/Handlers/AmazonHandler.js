const Constants = require('../Constants').Constants;
const CoreHandler = require('./CoreHandler').CoreHandler;

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
                case "launchLoopBack1":
                    return CoreHandler.MyMedication(request, response);
                case "launchLoopBack2":
                    return CoreHandler.Call(request, response);

                //--- medicationSchedule ---
                case "medicationScheduleLoopBack":
                    return CoreHandler.MedicationCalendar(request, response);

                //--- medicationLeft ---
                case "medicationLeftLoopBack":
                    return CoreHandler.MedicationLeft(request, response);

                //--- call ---
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
            response.shouldEndSession(endSession);
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

                //--- medicationSchedule ---
                case "medicationScheduleLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- medicationLeft ---
                case "medicationLeftLoopBack":
                    session.set('dialogState', 'unhandledClose');
                    speechOutput = Constants.TEXTS.unhandledClose;
                    endSession = true;
                    break;

                //--- call ---
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
           response.shouldEndSession(endSession);
           return response;
        }
};

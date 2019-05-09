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

            let speechOutput = 'Recibí una respuesta positiva';
            response.say('***' + dialogState + '***' + speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        },
    // No answer
    NoIntent:
        function (request, response) {
            let session = request.getSession();
            dialogState = session.get('dialogState');

            let speechOutput = 'Recibí una respuesta negativa';
            response.say('***' + dialogState + '***' + speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
};

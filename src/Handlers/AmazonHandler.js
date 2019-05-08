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
};

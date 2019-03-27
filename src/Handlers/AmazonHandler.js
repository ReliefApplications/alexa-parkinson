exports.AmazonHandler = {
    FallbackIntent:
        function (request, response) {
            let speechOutput = 'No he entendido la pregunta.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
    ,
    HelpIntent:
        function (request, response) {
            let speechOutput = 'Intente preguntar cuantas medicinas debes tomar. Tambien puedes quitar, diciendo stop o exit.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(false);
            return response;
        }
    ,
    CancelIntent:
        function (request, response) {
            let speechOutput = 'Hasta luego.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(true);
            return response;
        }
    ,
    StopIntent:
        function (request, response) {
            let speechOutput = 'Gracias por usar el Alexa skill Parkinson.';
            response.say(speechOutput);
            response.reprompt(speechOutput);
            response.shouldEndSession(true);
            return response;
        }
};

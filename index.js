/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {
        if (request.sessionDetails.application.applicationId !== applicationId) {
            // Fail ungracefully
            throw 'Invalid applicationId: ' + request.sessionDetails.application.applicationId;
        }
    };

    alexaApp.error = function (exception, request, response) {
        response.say('Lo sentimos, se encontró un error tratando su pregunta. Inténtalo más tarde.');
    };

    alexaApp.launch(function (request, response) {
        return CoreHandler.LaunchRequest(request, response);
    });

    alexaApp.intent('MyMedication', function (request, response) {
        return CoreHandler.MyMedication(request, response);
    });

    alexaApp.intent('Call', function (request, response) {
        return CoreHandler.Call(request, response);
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        return CoreHandler.MedicationCalendar(request, response);
    });

    alexaApp.intent('MedicationLeft', function (request, response) {
        return CoreHandler.MedicationLeft(request, response);
    });

    alexaApp.intent('AMAZON.FallbackIntent', function (request, response) {
        return AmazonHandler.FallbackIntent(request, response);
    });

    alexaApp.intent('AMAZON.HelpIntent', function (request, response) {
        return AmazonHandler.HelpIntent(request, response);
    });

    alexaApp.intent('AMAZON.CancelIntent', function (request, response) {
        return AmazonHandler.CancelIntent(request, response);
    });

    alexaApp.intent('AMAZON.StopIntent', function (request, response) {
        return AmazonHandler.StopIntent(request, response);
    });
};
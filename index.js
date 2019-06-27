/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const dialogue = require('./src/lib/dialogue/alexa-dialogue.js').dialogue;

const utils = require('./src/Utils').Utils;

const database = require('./src/lib/database/userdata');

function getUserIdFromRequest(request) {
    return request.sessionDetails.userId;
}


exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {
        if (request.sessionDetails.application.applicationId !== applicationId) {
            // Fail ungracefully
            throw 'Invalid applicationId: ' + request.sessionDetails.application.applicationId;
        }
        // Get the ASK (Alexa SKill) user ID from the request
        let userId = request.context.System.user.userId;
        // Use it to take the user from the database
        return database.getUser(userId)
            .then(user => {
                if (user !== null) {
                    // Store the user into the request object
                    request.currentUser = user;
                    response.say("Hola, " + user.name + "!");
                }
            }
            )
            .catch(res => utils.log(res));
    };

    alexaApp.error = function (exception, request, response) {
        response.say('Lo sentimos, se encontró un error tratando su pregunta. Inténtalo más tarde.');
        // response.shouldEndSession(false);
    };

    alexaApp.launch(function (request, response) {
        if (!request.currentUser) {
            response.say("Es esta la primera vez que nos encontramos. ¿Como te llamas?");
            response.shouldEndSession(false);
        } else {
            return CoreHandler.LaunchRequest(request, response);
        }
    });

    alexaApp.intent('Registration', function(request, response) {
        let output = dialogue.navigateTo('registration', request.slots, getUserIdFromRequest(request));
        if (output === undefined) {
            response.say("Por favor, dime tu nombre");
        } else {
            utils.log(request);
            utils.log(getUserIdFromRequest(request));
            return response.say("Encantada, " + output.name);
        }
        response.shouldEndSession(false);
    });

    alexaApp.intent('MyMedication', function (request, response) {
        // return CoreHandler.MyMedication(request, response);
        utils.log("the world is quiet here");
        return dialogue.navigateTo('myMedication', request.slots);
    });

    alexaApp.intent('Call', function (request, response) {
        // return CoreHandler.Call(request, response);
        return dialogue.navigateTo('Call', request, response);
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        // return CoreHandler.MedicationCalendar(request, response);
        let output = dialogue.navigateTo('MedicationCalendar', request, response);

        response.say(output.text);

        utils.displayIfSupported(
            request, response, output.title, output.text, output.image
        );

        response.shouldEndSession(output.shouldEnd);
    });

    alexaApp.intent('MedicationLeft', function (request, response) {
        // return CoreHandler.MedicationLeft(request, response);
        let output = dialogue.navigateTo('MedicationLeft', request, response);
        utils.respond(request, response, output);
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

    alexaApp.intent('AMAZON.RepeatIntent', function (request, response) {
        return AmazonHandler.RepeatIntent(request, response);
    });

    alexaApp.intent('AMAZON.YesIntent', function (request, response) {
        // return AmazonHandler.YesIntent(request, response);
        return dialogue.saidYes(request, response);
    });

    alexaApp.intent('AMAZON.NoIntent', function (request, response) {
        // return AmazonHandler.NoIntent(request, response);
        return dialogue.saidNo(request, response);
    });

    // Unhandled utterances
    alexaApp.intent('DidNotUnderstand', function (request, response) {
        // return CoreHandler.DidNotUnderstand(request,response);
        return dialogue.didNotUnderstand(request, response);
    })
};

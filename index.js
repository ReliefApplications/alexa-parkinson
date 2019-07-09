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
                }
            })
            .catch(res => {
                utils.log(res);
            });
    };

    alexaApp.error = function (exception, request, response) {
        response.say('Some error');
        utils.log(exception);
        // throw exception;
    };

    alexaApp.launch(function (request, response) {
        if (!request.currentUser) {
            response.say("Es esta la primera vez que nos encontramos. ¿Como te llamas?");
            response.shouldEndSession(false);
        } else {
            response.say("Hola, " + request.currentUser.name + "!");
            return CoreHandler.LaunchRequest(request, response);
        }
    });

    alexaApp.intent('Registration', function (request, response) {
        let output = dialogue.navigateTo('registration', request.slots, getUserIdFromRequest(request));
        if (output === undefined) {
            response.say("Por favor, dime tu nombre");
        } else {
            return response.say("Encantada, " + output.name);
        }
        response.shouldEndSession(false);
    });

    alexaApp.intent('MyMedication', function (request, response) {
        // return CoreHandler.MyMedication(request, response);
        return dialogue.navigateTo('myMedication', request, response);
    });

    alexaApp.intent('Call', function (request, response) {
        return dialogue.navigateTo('Call', request, response);
        // response.say("Hey");
    });

    alexaApp.intent('MedicineInformations', function (request, response) {
        return dialogue.navigateTo('MedicineInformations', request.slots)
            .then(output => {

                console.log(output);
                response.say(output.speak);
                response.shouldEndSession(false);
            });
        // response.say("Hey");
    });

    alexaApp.intent('CompleteTreatmentInsertion', function (request, response) {
        response.say("Lorem ipsum");
        console.table(request.slots);
        dialogue.navigateTo('CompleteTreatmentInsertion', request.slots, request.currentUser)
            .then(updatedUser => {
                Object.keys(updatedUser.calendar).forEach(x => {
                    console.log(x);
                    console.table(updatedUser.calendar[x]);
                });
                console.log(JSON.stringify(updatedUser));
                response.shouldEndSession(false);
            });
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        response.say("medication calendar intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('MedicationLeft', function (request, response) {
        response.say("medication left intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.FallbackIntent', function (request, response) {
        response.say("fall back intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.HelpIntent', function (request, response) {
        response.say("help intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.CancelIntent', function (request, response) {
        response.say("cancel intent");
        response.shouldEndSession(true);
    });

    alexaApp.intent('AMAZON.StopIntent', function (request, response) {
        response.say("stop intent");
        response.shouldEndSession(true);
    });

    alexaApp.intent('AMAZON.RepeatIntent', function (request, response) {
        response.say("repeat intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.YesIntent', function (request, response) {
        dialogue.saidYes();
        // response.say("yes intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.NoIntent', function (request, response) {
        dialogue.saidNo();
        response.shouldEndSession(false);
    });

    // Unhandled utterances
    alexaApp.intent('DidNotUnderstand', function (request, response) {
        // return CoreHandler.DidNotUnderstand(request,response);
        return dialogue.didNotUnderstand(request, response);
    })
};

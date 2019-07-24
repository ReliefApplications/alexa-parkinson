/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const dialogue = require('./src/lib/dialogue/alexa-dialogue.js').dialogue;

const utils = require('./src/Utils').Utils;

const database = require('./src/lib/database/userdata');

const constants = require('./src/Constants');

function getUserIdFromRequest(request) {
    return request.sessionDetails.userId;
}

exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {

        console.log("SLOTS");
        console.table(request.slots);

        // If calling with some api tester (like Postman) the request object is different
        let remoteApplicationID = request.sessionDetails.application.applicationId || request.applicationId;

        if (remoteApplicationID !== applicationId) {
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
        response.say('¿No te entendi, puedes repetir por favor?');
        utils.log(exception);
        // throw exception;
        response.shouldEndSession(false);
    };

    alexaApp.launch(function (request, response) {
        if (!request.currentUser) {
            let userId = request.context.System.user.userId;
            database.addNewUser(userId)
                .then(value => {
                    response.shouldEndSession(false);
                });
        } else {
            return CoreHandler.LaunchRequest(request, response);
        }
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
            })
            .catch(err => {
                console.log("Error on MedicineInformations ", err);
                response.say("Perdona, puedes repetir por favor?")
                response.shouldEndSession(false);
            });
    });

    alexaApp.intent('CompleteTreatmentInsertion', function (request, response) {

        // console.table(request.slots);
        return dialogue.navigateTo('CompleteTreatmentInsertion', request.slots, request.currentUser)
            .then(updatedUser => {
                Object.keys(updatedUser.calendar).forEach(x => {
                    utils.log(x);
                    utils.log("INTO FINAL FOR EACH");
                    utils.log(updatedUser.calendar[x]);
                });
                response.say("Medicamento añadido a tu calendario ¿Quieres añadir otro?");
                return updatedUser;
            })
            .then((updatedUser) => {
                utils.log(JSON.stringify(updatedUser))
                return response.shouldEndSession(false);
            })
            .catch((medicines) => {
                utils.log("medicines in catch", medicines);
                response.say("Tengo mas de un medicamento con este nombre. Puede ser mas specifico? Por ejemplo");
                
                // Take just the first 2, don't make ouput too long
                response.say(medicines.slice(0, 2).map(x => x.product).join(', '));
                
                return response.shouldEndSession(false);
            });
    });

    alexaApp.intent('MedicineConfirmation', function (request, response) {
        return dialogue.navigateTo('medicine-choose-confirmation', request.slots, request.currentUser)
            .then((user) => {
                utils.log("Got", user);
                response.say(constants.insertionText);
                utils.log("On monday", user.calendar.monday);
                utils.log("Timing", user.calendar.monday[0].moments);
                response.say("Medicamento añadido a tu calendario ¿Quieres añadir otro?");

                response.shouldEndSession(false);
            })
            .catch(err => {
                response.say("Medicamento añadido a tu calendario ¿Quieres añadir otro?");
                // response.say(constants.TEXTS.errors[err.error]);
                response.shouldEndSession(false);
            });
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        return dialogue.navigateTo('MedicationCalendar', request.currentUser, request.slots)
            .then(result => {
                utils.log("GOT", result);
                let formattedMedicines = result[0].medicines.map(x => x.product).join(',');
                if (formattedMedicines.length === 0) response.say('No debe tomar medication.');
                else response.say(formattedMedicines);
                response.say("¿Te puedo ayudar de alguna otra manera?");
                response.shouldEndSession(false);
            });
    });

    alexaApp.intent('Help', function (request, response) {
        return dialogue.navigateTo('Help')
            .then(([speech, title, text]) => {

                response.say(speech);

                if (utils.supportsDisplay(request)) {
                    utils.log("Display is supported");
                    response.directive(utils.renderBodyTemplate(
                        constants.IMAGES.defaultImage,
                        title,
                        text
                    ));
                }
                response.shouldEndSession(false)
            });
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
        dialogue.saidYes(request, response);
        console.log("YES");
        // response.say("yes intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.NoIntent', function (request, response) {
        dialogue.saidNo(request, response);
        response.shouldEndSession(false);

    });

    // Unhandled utterances
    alexaApp.intent('DidNotUnderstand', function (request, response) {
        // return CoreHandler.DidNotUnderstand(request,response);
        return dialogue.didNotUnderstand(request, response);
    })
};

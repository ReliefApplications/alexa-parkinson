/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const dialogue = require('./src/lib/dialogue/alexa-dialogue.js').dialogue;

const utils = require('./src/Utils').Utils;

const database = require('./src/lib/database/userdata');

const constants = require('./src/Constants');

const SkillDictionary = require('./src/lib');
const SkillMemory = require('./src/lib/models/skill-memory');
const MemoryHandler = require('./src/lib/services/memory-handler');

function getUserIdFromRequest(request) {
    return request.sessionDetails.userId;
}

exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {

        MemoryHandler.updateHotMemory();

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
        return SkillDictionary.medicine.information(request, response);
    });

    alexaApp.intent('CompleteTreatmentInsertion', function (request, response) {

        console.log("\n // ===== Complete Treatment Insertion ===== // \n")
        console.log(request.slots);
        console.log("// ===== // \n");
        
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
            // Take just the first 2, don't make ouput too long
            let slicedMedicines = medicines.slice(0, 2).map(x => x.product).join(', ');

            response.say(`Tengo mas de un medicamento con este nombre. Puede ser mas specifico? Por ejemplo ${slicedMedicines}`);
            return response.shouldEndSession(false);
        });
    });

    alexaApp.intent('MedicineConfirmation', function (request, response) {

        console.log("\n\n // ===== Medicine Confirmation ===== // \n")
        console.log(request.slots);
        console.log("// ===== // \n");

        return dialogue.navigateTo('medicine-choose-confirmation', request.slots, request.currentUser)
            .then((user) => {
                utils.log("Got", user);
                response.say(constants.insertionText);
                utils.log("On monday", user.calendar.monday);
                utils.log("Timing", user.calendar.monday[0].moments);
                response.say(utils.getText(constants.texts.medicineinsertion).text);
                response.shouldEndSession(false);
            })
            .catch(err => {
                // Thrown when we have no medicine or more than one
                response.say(utils.getText(constants.texts.medicineinsertion).text);
                // response.say(constants.TEXTS.errors[err.error]);
                response.shouldEndSession(false);
            });
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        return SkillDictionary.medication.calendar(request, response);
    });

    alexaApp.intent('Help', function (request, response) {
        return SkillDictionary.help(request, response);
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
        return SkillDictionary.help(request, response);
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
        return MemoryHandler.onRepeat(request, response);
    });

    alexaApp.intent('AMAZON.YesIntent', function (request, response) {
        return MemoryHandler.onYes(request, response);
    });

    alexaApp.intent('AMAZON.NoIntent', function (request, response) {
        return MemoryHandler.onNo(request, response);
    });

    alexaApp.intent('DidNotUnderstand', function (request, response) {
        response.say('Perdona. No he podido encontrar la respuesta a lo que me has preguntado. Quieres ayuda ?');

        MemoryHandler.setMemory(new SkillMemory(
            'MedecineCalendar', 'No tenia la respuesta a lo que me había preguntado. Di "ayudame" si quieres saber lo que puedes hacer.',
            (req, res) => { return SkillDictionary.help(req, res); },
            (req, res) => { return SkillDictionary.end(req, res); })
        );

        response.shouldEndSession(false);
    })
};

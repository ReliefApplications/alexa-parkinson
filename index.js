/** import handlers */
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const utils = require('./src/Utils').Utils;

const database = require('./src/lib/database/userdata');

const SkillDictionary = require('./src/lib');
const SkillMemory = require('./src/lib/models/skill-memory');
const MemoryHandler = require('./src/lib/services/memory-handler');

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
            return SkillDictionary.alexa.launch(request, response);
        }
    });

    alexaApp.intent('MyMedication', function (request, response) {
        return SkillDictionary.medication.menu(request, response);
    });

    alexaApp.intent('Call', function (request, response) {
        return SkillDictionary.call(request, response);
    });

    alexaApp.intent('MedicineInformations', function (request, response) {
        return SkillDictionary.medicine.information(request, response);
    });

    alexaApp.intent('CompleteTreatmentInsertion', function (request, response) {
        return SkillDictionary.medication.insertion.insertion(request, response);
    });

    alexaApp.intent('MedicineConfirmation', function (request, response) {
        return SkillDictionary.medication.insertion.confirmation(request, response);
    });

    alexaApp.intent('MedicationCalendar', function (request, response) {
        return SkillDictionary.medication.calendar(request, response);
    });

    alexaApp.intent('MedicationLeft', function (request, response) {
        return SkillDictionary.medication.inventory(request, response);
    });

    alexaApp.intent('AMAZON.FallbackIntent', function (request, response) {
        response.say("fall back intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.HelpIntent', function (request, response) {
        return SkillDictionary.help(request, response);
    });

    alexaApp.intent('ParkinsonOptions', function (request, response) {
        return SkillDictionary.parkinsonOptions(request, response);
    });

    alexaApp.intent('ParkinsonMoreOptions', function (request, response) {
        return SkillDictionary.parkinsonMoreOptions(request, response);
    });

    alexaApp.intent('AMAZON.CancelIntent', function (request, response) {
        return SkillDictionary.alexa.cancel(request, response);
    });

    alexaApp.intent('AMAZON.StopIntent', function (request, response) {
        return SkillDictionary.alexa.stop(request, response);
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
            'MedecineCalendar', 'No tenia la respuesta a lo que me había preguntado. Di "ayudame" si quieres saber lo que puedes hacer.', {},
            (req, res) => { return SkillDictionary.help(req, res); },
            (req, res) => { return SkillDictionary.alexa.stop(req, res); })
        );

        response.shouldEndSession(false);
    })
};

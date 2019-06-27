/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const dialogue = require('./src/lib/dialogue/alexa-dialogue.js').dialogue;

const utils = require('./src/Utils').Utils;

const database = require('./src/lib/database/userdata');

exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {
        if (request.sessionDetails.application.applicationId !== applicationId) {
            // Fail ungracefully
            throw 'Invalid applicationId: ' + request.sessionDetails.application.applicationId;
        }
        // Get the ASK (Alexa SKill) user ID from the request
        let userId = request.context.System.user.userId;
        // Use it to take the user from the database
        // return database.getUser(userId)
        //     .then(user => {
        //         if (user !== null) {
        //             // Store the user into the request object
        //             request.currentUser = user;
        //         } else {
        //             // TODO put in constants
        //             response.say("Es esta la primera vez que nos encontramos. ¿Como te llamas?");
        //             // Should we end the session at this point?
        //             // TODO investigate
        //         }
        //     }
        //     )
        //     .catch(res => utils.log(res));
    };

    alexaApp.error = function (exception, request, response) {
        response.say('Some error');
    };

    alexaApp.launch(function (request, response) {
        response.say("launch intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('Registration', function(request, response) {
        let output = dialogue.navigateTo('registration', request.slots);
        response.say("Tu nombre es " + output.name);
    });

    alexaApp.intent('MyMedication', function (request, response) {
        response.say("my medication intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('Call', function (request, response) {

        return new Promise(function(resolve,reject) {
            const connection = mysql.createConnection({
                host: 'db',
                port: 3306,
                user: 'parkinson_user',
                password: 'aA12345',
                database: 'alexa_parkinson'
            });
            connection.connect(function(err){
                if(!err) {
                    resolve("Connection");
                }else{
                    resolve("Broken");
                }
            });
        }).then((res) => {
            response.say(res);
            return response.send();
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
        response.say("yes intent");
        response.shouldEndSession(false);
    });

    alexaApp.intent('AMAZON.NoIntent', function (request, response) {
        response.say("no intent");
        response.shouldEndSession(false);
    });

    // Unhandled utterances
    alexaApp.intent('DidNotUnderstand', function (request, response) {
        // return CoreHandler.DidNotUnderstand(request,response);
        return dialogue.didNotUnderstand(request, response);
    })
};

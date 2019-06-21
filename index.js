/** import handlers */
const AmazonHandler = require('./src/Handlers/AmazonHandler').AmazonHandler;
const CoreHandler = require('./src/Handlers/CoreHandler').CoreHandler;
const applicationId = 'amzn1.ask.skill.c671c665-5983-4ca9-ba1b-317809409a26';

const mysql = require('mysql');

exports.handler = function (alexaApp) {

    alexaApp.pre = function (request, response, type) {
        if (request.sessionDetails.application.applicationId !== applicationId) {
            // Fail ungracefully
            throw 'Invalid applicationId: ' + request.sessionDetails.application.applicationId;
        }
    };

    alexaApp.error = function (exception, request, response) {
        response.say('Some error');
    };

    alexaApp.launch(function (request, response) {
        response.say("launch intent");
        response.shouldEndSession(false);
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
        response.say("not understand intent");
        response.shouldEndSession(false);
    });
};
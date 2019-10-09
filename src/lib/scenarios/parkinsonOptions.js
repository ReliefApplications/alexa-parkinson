const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const Locale = require('../locale/es').ParkinsonOptions;
const RequestHandler = require('./../services/request-handler');
const LocaleGeneral = require('../locale/es').General;
const Constants = require('./../../Constants');
const Utils = require('./../../Utils').Utils;

/**
 * Display options
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return new Promise( function (resolve, reject) {

        // used to know what options is called by the user
        const calendar = ['CALENDAR'].includes( RequestHandler.getSlotId(request.slots.helpOptions));
        const information = ['INFORMATION'].includes( RequestHandler.getSlotId(request.slots.helpOptions));
        const medication = ['MEDICATION'].includes( RequestHandler.getSlotId(request.slots.helpOptions));
        const call = ['CALL'].includes( RequestHandler.getSlotId(request.slots.helpOptions));
        let localmsg;

        if (calendar) {
            localmsg = Locale.calendar();
            Utils.setDialogState(request, 'calendar'); // Save the actual options outside the intent
            sayOptions(localmsg);
        }
        if (information) {
            localmsg = Locale.information();
            Utils.setDialogState(request, 'information');
            sayOptions(localmsg);
        }
        if (medication) {
            localmsg = Locale.medication();
            Utils.setDialogState(request, 'medication');
            sayOptions(localmsg);
        }
        if (call) {
            localmsg = Locale.call();
            Utils.setDialogState(request, 'call');
            sayOptions(localmsg);
        }

        function sayOptions(localmsg) {
            let msg = localmsg + Locale.reprompt();
            if ( msg ) { response.say(msg); }
            if ( Utils.supportsDisplay(request) ) {
                response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), msg ));
            }
        }
        
        if (['MORE'].includes( RequestHandler.getSlotId(request.slots.helpOptions))) {
            response.say('')
            dialogState = Utils.getDialogState(request); // get the last options displayed

            let session = request.getSession();

            switch(dialogState) {
                // switch between the options to display them all
                case 'calendar':
                    localmsg = Locale.information();
                    sayOptions(localmsg);
                    session.set('dialogState', 'information');
                    
                    break;
                case 'information':
                    localmsg = Locale.medication();
                    sayOptions(localmsg);
                    session.set('dialogState', 'medication');
                    break;
                case 'medication':
                    localmsg = Locale.call();
                    sayOptions(localmsg);
                    session.set('dialogState', 'call');
                    break;
                case 'call':
                    localmsg = Locale.calendar();
                    sayOptions(localmsg);
                    session.set('dialogState', 'calendar');
                    break;
                default:
                    localmsg = Locale.calendar();
                    sayOptions(localmsg);
                    session.set('dialogState', 'calendar');
            }
        } 
        
        if (!['CALL','INFORMATION','MEDICATION','CALENDAR', 'MORE'].includes( RequestHandler.getSlotId(request.slots.helpOptions))) {
            let msg = Locale.calendar() + Locale.reprompt();
            if ( msg ) { response.say(msg); }
            if ( Utils.supportsDisplay(request) ) {
                response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), msg ));
            }
        } 
        response.reprompt(Locale.reprompt());
        response.send();
        response.shouldEndSession(false);
    

        MemoryHandler.setMemory(new SkillMemory(
            'Help', LocaleGeneral.continue(), {},
            (req, res) => { return require('./parkinsonOptions')(req, res); },
            (req, res) => { return require('./alexa-confirmation')(req, res); }
        ));
        resolve();
    });
}
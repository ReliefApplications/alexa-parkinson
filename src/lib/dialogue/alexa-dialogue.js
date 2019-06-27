const tree = require('./dialogue-tree').trees;

const Utils = require('../../Utils').Utils;
const Constants = require('../../Constants').Constants;

const call = require('./scenarios/call').callIntent;
const medicationCalendar = require('./scenarios/medication-calendar').medicationCalendarIntent;
const medicationLeft = require('./scenarios/medication-left').medicationsLeftIntent;
const registration = require('./scenarios/registration').registrationIntent;
// Utility variables
const texts = Constants.TEXTS;
const images = Constants.IMAGES;



const dialogue = new tree.StateTree();
const State = tree.State;


const myMedication = new State(
    // What to do after "Mi medicaciones"
    ([request, response]) => {
        response.say(texts.myMedicationText);
        response.reprompt(texts.myMedicationReprompt);

        if (Utils.supportsDisplay(request)) {
            response.directive(Utils.renderBodyTemplate(
                images.defaultImage,
                texts.myMedicationTitle,
                texts.myMedicationText)
                );
        }
        response.shouldEndSession(false);

    },

    (request, response) => {
        response.shouldEndSession(false);
    },

    (request, response) => {
        response.shouldEndSession(false);
    },

    (request, response) => {
        response.shouldEndSession(false);
    }
);


dialogue.addIntentAction('myMedication', myMedication);
dialogue.addIntentAction('Call', call);
dialogue.addIntentAction('MedicationCalendar', medicationCalendar);
dialogue.addIntentAction('MedicationLeft', medicationLeft);
dialogue.addIntentAction('registration', registration);

module.exports.dialogue = dialogue;

const tree = require('./dialogue-tree').trees;

const Utils = require('../../Utils').Utils;
const Constants = require('../../Constants').Constants;

const call = require('./tree/call-dialogue');

// Utility variables
const texts = Constants.TEXTS;
const images = Constants.IMAGES;



const dialogue = new tree.StateTree();
const State = tree.State;


const myMedication = new State(
    // What to do after "Mi medicaciones"
    (request, response) => {
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
        return response;
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
dialogue.addIntentAction('Call', )
module.exports.dialogue = dialogue;

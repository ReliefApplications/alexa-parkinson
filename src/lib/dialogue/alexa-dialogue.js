const tree = require('./dialogue-tree').trees;

const Utils = require('../../Utils').Utils;
const Constants = require('../../Constants').Constants;

// Utility variables
const texts = Constants.TEXTS;
const images = Constants.IMAGES;



const dialogue = new tree.StateTree();
const State = tree.State;


let myMedication = new State(
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
        response.say("😁😁♋♋ PArte 2");
        response.shouldEndSession(false);
        return response;
    },

    (request, response) => {
        response.say("Borbones 🐏es");
        response.shouldEndSession(false);
    },

    (request, response) => {
        response.say("A respondido no");
        response.shouldEndSession(false);
    },

    (request, response) => {
        response.say("Estamos en la funcion de no comprension");
        response.shouldEndSession(false);
    }
);


dialogue.addIntentAction('myMedication', myMedication);

module.exports.dialogue = dialogue;

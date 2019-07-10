const tree = require('./dialogue-tree').trees;

const Utils = require('../../Utils').Utils;
const Constants = require('../../Constants').Constants;

const call = require('./scenarios/call').callIntent;
const medicationCalendar = require('./scenarios/medication-calendar').medicationCalendarIntent;
const medicationLeft = require('./scenarios/medication-left').medicationsLeftIntent;
const registration = require('./scenarios/registration').registrationIntent;
const medicineInformation = require('./scenarios/medicine-informations').medicineInfoIntent;
const treatmentInsertion = require('./scenarios/treatment-insertion').treatmentInsertion;

// Utility variables
const texts = Constants.TEXTS;
const images = Constants.IMAGES;



const dialogue = new tree.StateTree({
    // Root callback (if not defined throws an error)
    main: () => {}
});
const State = tree.State;

const myMedication = new State({
    // What to do after "Mi medicaciones"
    main: ([request, response]) => {
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
        
    yes: (request, response) => {
        response.shouldEndSession(false);
    },
    
    no: (request, response) => {
        response.shouldEndSession(false);
    },
    
    didNotUnderstand: (request, response) => {
        response.shouldEndSession(false);
    }
});

dialogue.addIntentAction('myMedication', myMedication);
dialogue.addIntentAction('Call', call);
dialogue.addIntentAction('MedicationCalendar', medicationCalendar);
dialogue.addIntentAction('MedicationLeft', medicationLeft);
dialogue.addIntentAction('registration', registration);
dialogue.addIntentAction('MedicineInformations', medicineInformation);
dialogue.addIntentAction('CompleteTreatmentInsertion', treatmentInsertion);
module.exports.dialogue = dialogue;

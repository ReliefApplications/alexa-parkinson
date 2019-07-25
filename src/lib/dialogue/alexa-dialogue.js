/**
 * This is an example of a dialogue node.
 * 
 * Below are grouped all the nodes in the scenarios/ folder together with their 'hash' name.
 * 
 * In myMedication three functions are defined: main (mandatory), yes, now and "did not understand"
 * 
 * Later the myMedication node is added to the dialogue tree with the 'myMedication' name
 * 
 * In this example, the main function takes both the request and the response.
 * This was just an experiment and an
 * example, we should check slot values in the intent handler and pass only
 * relevant informations to respect a sort of MVC pattern.
 */


const tree = require('./dialogue-tree').trees;

const Utils = require('../../Utils').Utils;
const Constants = require('../../Constants');

const call = require('./scenarios/call').callIntent;
const medicationCalendar = require('./scenarios/medication-calendar').medicationCalendarIntent;
const medicationLeft = require('./scenarios/medication-left').medicationsLeftIntent;
const registration = require('./scenarios/registration').registrationIntent;
const medicineInformation = require('./scenarios/medicine-informations').medicineInfoIntent;
const treatmentInsertion = require('./scenarios/treatment-insertion').treatmentInsertion;
const help = require('./scenarios/help');

// Utility variables
const texts = Constants.texts;
const images = Constants.images;


const State = tree.State;

const myMedication = new State({
    // What to do after "Mi medicaciones"
    main: ([request, response]) => {

        const myMedicationTexts = getText(Constants.texts.mymedication);

        response.say(myMedicationTexts.text);
        response.reprompt(myMedicationTexts.reprompt);
        
        if (Utils.supportsDisplay(request)) {
            response.directive(Utils.renderBodyTemplate(
                images.defaultImage,
                myMedicationTexts.title,
                myMedicationTexts.text)
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


/**
 * Tree dialogue that handles all the conversation
 */
const dialogue = new tree.StateTree({
    // Root callback (if not defined throws an error)
    main: () => {}
});

dialogue.addIntentAction('myMedication', myMedication);
dialogue.addIntentAction('Call', call);
dialogue.addIntentAction('MedicationCalendar', medicationCalendar);
dialogue.addIntentAction('MedicationLeft', medicationLeft);
dialogue.addIntentAction('MedicineInformations', medicineInformation);
dialogue.addIntentAction('CompleteTreatmentInsertion', treatmentInsertion);
dialogue.addIntentAction('Help', help);

module.exports.dialogue = dialogue;

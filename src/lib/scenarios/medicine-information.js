const MedicineService = require('./../database/medicinedata');
const RequestHandler = require('./../services/request-handler');
const Locale = require('../locale/es').MedicineInformation;
const LocaleGeneral = require('../locale/es').General;
const Constants = require('./../../Constants');
const Utils = require('./../../Utils').Utils;
const SkillMemory = require('./../models/skill-memory');
const MemoryHandler = require('./../services/memory-handler');
const skillName = 'MedecineCalendar';

/**
 * Return informations about a medicine
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return MedicineService.getMedicineByFormattedName(request.slots.medicineBrandName.value)
    .then( function(medicines) {

        if ( !medicines ) { 
            response.say( Locale.noMedicationFound() );
            response.send();
            return response.shouldEndSession(false);
        }

        if ( ['INFO','ACTIVE_PRINCIPLE'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = sayPrincipiosActivos(request.slots.medicineBrandName.value, medicines[0].active_principle);
            if ( msg ) { response.say(msg); }
            if (!['INFO'].includes( RequestHandler.getSlotId(request.slots.medicineInformation))) {
                if ( Utils.supportsDisplay(request) ) {
                    response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), msg ));
                }
            }
        }

        if ( ['INFO','EFFECT'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = saySideEffects(request.slots.medicineBrandName.value, medicines[0].side_effects);
            if ( msg ) { response.say(msg); }
            if (!['INFO'].includes( RequestHandler.getSlotId(request.slots.medicineInformation))) {
                if ( Utils.supportsDisplay(request) ) {
                    response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), msg ));
                }
            }
        }

        if ( ['INFO','FORM','COLOR'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = sayPillShape(request.slots.medicineBrandName.value, medicines);
            if ( msg ) { response.say(msg); }
            if ( Utils.supportsDisplay(request) ) {
                const img = Locale.medicineImage(request.slots.medicineBrandName.value);
                if (img) {
                    response.directive(Utils.renderBodyTemplateImage(Locale.title(), img));
                }
                response.directive(Utils.renderBodyTemplate(Constants.images.welcomeImage, Locale.title(), msg ));
            }
        }

        MemoryHandler.setMemory(new SkillMemory(
            skillName, LocaleGeneral.continue(), {},
            (req, res) => { return require('./help')(req, res); },
            (req, res) => { return require('./alexa-confirmation')(req, res); }
        ));

        response.say( LocaleGeneral.continue() );
        response.send();
        return response.shouldEndSession(false);
    })
    .catch( function(err) {
        response.say( Locale.error() );
        response.send();
        return response.shouldEndSession(false);
    });
};

/**
 * Construct a sentence with the active principle of a medicine
 * @param {string} medicineName name of the medicine
 * @param {string} principios text with contains principios activos
 * @returns {string | undefined} A phrase talking about principios activos
 */
function sayPrincipiosActivos(medicineName, principios) {
    return Locale.activePrinciples(medicineName.trim(), principios.toLowerCase().split('/'));
}

function sayMedicineImage(medicineName) {
    return Locale.medicineImage(medicineName);
}

/**
 * Construct a sentence with the side effects of a medicine
 * @param {string} medicineName name of the medicine
 * @param {string} effects text with contains medicine's effects
 * @returns {string | undefined} A phrase talking about medicine's effects
 */
function saySideEffects(medicineName, effects) {
    return Locale.sideEffects(medicineName.trim(), effects.toLowerCase().split('/'));
}

/**
 * Construct a sentence with the pile shapes & color of a medicine
 * @param {string} medicineName name of the medicine
 * @param {Array<Medicines>} listMedicines list of medicines
 * @returns {string | undefined} A phrase talking about medicine's shape & color
 */
function sayPillShape(medicineName, listMedicines) {
    let msg = undefined;

    // Check the number of references for a given medicine.
    if ( listMedicines.length > 1 ) {
        // If there is multiple references, we'll do tests to check some unicity a send a custom message

        // Group medicine names by shape
        const shapes = [];
        listMedicines.forEach( medicine => {
            let shapeId = shapes.findIndex( m => { return m.shape === medicine.shape });
            if ( shapeId > -1 ) shapes[shapeId].products.push(medicine.product);
            else shapes.push({ products: [medicine.product], shape: medicine.shape });
        });

        // Group medicine names by color
        const colors = [];
        listMedicines.forEach( medicine => {
            let colorId = colors.findIndex( m => { return m.color === medicine.color });
            if ( colorId > -1 ) colors[colorId].products.push(medicine.product);
            else colors.push({ products: [medicine.product], color: medicine.color });
        });

        // Find a text matching with the two groups
        msg = Locale.shapeColors(medicineName.trim(), shapes, colors);
    }
    
    // See if there is a unique color

    return msg;
}

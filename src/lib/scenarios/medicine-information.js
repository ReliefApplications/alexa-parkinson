const MedicineService = require('./../database/medicinedata');
const RequestHandler = require('./../services/request-handler');

/**
 * Return informations about a medicine
 * @param {*} request
 * @param {*} response
 */
module.exports = function (request, response) {
    return MedicineService.getMedicineByFormattedName(request.slots.medicineBrandName.value)
    .then( function(medicines) {

        if ( !medicines ) { 
            response.say('No conozco medication con este nombre. Te puedo ayudar de alguna otra manera ?');
            response.send();
            return response.shouldEndSession(false);
        }

        if ( ['INFO','ACTIVE_PRINCIPLE'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = sayPrincipiosActivos(request.slots.medicineBrandName.value, medicines[0].active_principle);
            if ( msg ) { response.say(msg); response.send(); }
        }

        if ( ['INFO','EFFECT'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = saySideEffects(request.slots.medicineBrandName.value, medicines[0].side_effects);
            if ( msg ) { response.say(msg); response.send(); }
        }

        if ( ['INFO','FORM','COLOR'].includes( RequestHandler.getSlotId(request.slots.medicineInformation) ) ) {
            const msg = sayPillShape(request.slots.medicineBrandName.value, medicines);
            if ( msg ) { response.say(msg); response.send(); }
        }

        return response.shouldEndSession(false);
    })
    .catch( function(err) {
        response.say('No puedo leer las informationes. Te puedo ayudar de alguna otra manera ?');
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
    let msg = undefined;
    const activePrinciple = principios.toLowerCase().split('/');
    if ( activePrinciple.length > 1 ) {
        msg = `Los principios activos del ${medicineName.trim()} son : `;
        activePrinciple.forEach( (ap, index) => {
            msg += `el ${ap}`;
            msg += index < activePrinciple.length - 2 ? ', ' : (index < activePrinciple.length - 1 ? ', y ' : '.');
        });
    } else if ( activePrinciple.length === 1 ) {
        msg = `El principio activo del ${medicineName} es el ${activePrinciple[0]}.`;
    } else {
        `El ${medicineName} no tiene principio activo.`
    }
    return msg;
}

/**
 * Construct a sentence with the side effects of a medicine
 * @param {string} medicineName name of the medicine
 * @param {string} effects text with contains medicine's effects
 * @returns {string | undefined} A phrase talking about medicine's effects
 */
function saySideEffects(medicineName, effects) {
    let msg = undefined;
    const splitEffets = effects.toLowerCase().split('/');
    if ( splitEffets.length > 1 ) {
        msg = `Tiene algunos efectos secundarios como `;
        splitEffets.forEach( (effet, index) => {
            msg += `${effet.trim()}`;
            msg += index < splitEffets.length - 2 ? ', ' : (index < splitEffets.length - 1 ? ', o ' : '.');
        });
    } else if ( splitEffets.length === 1 ) {
        msg = `El principal efecto secundario del ${medicineName.trim()} es ${splitEffets[0].trim()}.`;
    } else {
        msg = `No tiene efecto secundario.`;
    }
    return msg;
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
        if ( shapes.length > 1 && colors.length > 1 ) {
            msg = `Las medicamentos ${ medicineName } tienen diferentes formas y colores dependiendo de la referencia.`;
        } else if ( shapes.length > 1 && colors.length === 1 ) {
            msg = `Las medicamentos ${ medicineName } tienen la misma color : ${ colors[0].color }. `;
            msg += `Sin embargo, su forma depende de la referencia. Por ejemplo, `
            msg += `el ${ shapes[0].products[0] } es una ${ shapes[0].shape }, `
            msg += `pero el ${ shapes[1].products[0] } es una ${ shapes[1].shape }. `
        } else if ( shapes.length === 1 && colors.length > 1 ) {
            msg = `Las medicamentos ${ medicineName } tienen la misma forma : ${ shapes[0].shape }. `;
            msg += `Sin embargo, su color depende de la referencia. Por ejemplo, `
            msg += `el ${ colors[0].products[0] } es de color ${ colors[0].color }, `
            msg += `pero el ${ colors[1].products[0] } es ${ colors[1].color }. `
        } else if ( shapes.length === 1 && colors.length === 1 ) {
            msg = `Todas las medicinas ${ medicineName } tienen la misma apariencia : son ${ shapes[0].shape } ${ colors[0].color }.`;
        }
    }
    
    // See if there is a unique color

    return msg;
}

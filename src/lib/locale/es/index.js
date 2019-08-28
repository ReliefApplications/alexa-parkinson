const Dictionary = require('./dictionary');

// =============================================
// Translation objects that construct sentences.
// They are called by their respective scenarios
// =============================================

exports.General = {
    continue: function() {
        return pickAnswerAtRandom(['Qué quieres hacer más ? ', 'Quires hacer algo más ? ', 'Algo más ? ', 'Puedo ayudarte en otra cosa ? ']);
    },
    workInProgress: function() {
        return 'Este functionalidad no es lista . Quieres hacer otra cosa ?';
    }
}

exports.AlexaCancel = {
    cancel: function() { return 'Vale. Qué quieres más ?'}
}

exports.AlexaLaunch = {
    title: function() { return 'Bienvenido a la skill de Asistencia Parkinson.'; },
    text: function() { return 'Queremos ofrecerte toda la información sobre tu medicación además de darte la posibilidad de consultar tus dudas con la Asociación Parkinson Madrid. \nDi “Mi Medicación” o “Llamar”'; },
    reprompt: function() { return 'Di “Mi Medicación”, “Llamar” o pregúntame “¿Qué puedo hacer?”'; }
}

exports.AlexaStop = {
    stop: function() { return 'Vale. Detengo la Skill.'}
}

exports.AlexaHelp = {
    help: function() { 
        return 'Puedes crear un calendario de medicación. Di por ejemplo “Tengo que tomar medicación” . ' +
            'Puedes preguntar qué medicación tienes en tu calendario. Di por ejemplo “¿Qué medicamentos tengo que tomar hoy?” . ' +
            'También puedes obtener información sobre cualquier medicación relacionada con el Parkinson. Di por ejemplo: “Efectos secundarios del Sinemet” . ' +
            'Además puedes llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación” .';
    },
    reprompt: function() { return 'Dime lo que quieres hacer'; }
}

exports.Call = {

}

exports.MedicationCalendar = {
    momentMedication: function(moment, calendar) { return `Por la ${ Dictionary[moment] }, ${ synonyms.must() } tomar ${ calendar[moment] } . `.split('/').join(' barra '); },
    noMedicationOnMoment: function(moment) { return `No ${ synonyms.must() } tomar ${ synonyms.medicament() } esta ${ Dictionary[moment] } . ` },
    noMedicationOnDay: function() { return `No ${ synonyms.must() } tomar ${ synonyms.medicament() } este día . ` },
    error: function() { return 'No puedo leer tu calendario. Te puedo ayudar de alguna otra manera ?' }
}

exports.MedicationInsertion = {
    doSearch: function(medicineName) { return `Quires que hace una búsqueda sobre "${medicineName.trim()}" ? `},
    addedToCalendar: function() { return `Medicamento añadido a tu calendario . `},
    medicineMultipleTitle: function(medicineName) { return `Medicationes que corresponden a "${medicineName.trim()}"`},
    medicineMultipleFound: function(medicine, exemples) { 
        return `Tengo mas de un medicamento que se llaman "${ medicine }" . Puede ser mas specifico ? ` +
        `Por ejamplo, conozco el ${exemples[0].product}, o el ${exemples[1].product}.`.split('/').join(' barra ');
    },
    medicineNotFound: function(medicine) { return `Después de buscar, no pude encontrar un medicamento que se llama "${ medicine }" . Dime el nombre de la medication, por favor.`}
}

exports.MedicationMenu = {
    title: function() { return "Mi medicación"; },
    text: function() { return "Ok, pregúntame por tu medicación programada. Por ejemplo di: ¿Qué medicación tengo que tomar hoy? O pregúntame “¿Qué puedo hacer?”"; },
    reprompt: function() { return "Disculpa ¿Quieres información sobre tu medicación de hoy?" },
}

exports.MedicineInformation = {
    error: function() { return 'No puedo leer las informationes. Te puedo ayudar de alguna otra manera ?'; },
    noMedicationFound: function() { return 'No conozco medication con este nombre. Te puedo ayudar de alguna otra manera ?'; },
    /**
     * Return a sentence saying medicine's active principles
     * @param {string} medicineName 
     * @param {string[]} activePrinciples 
     */
    activePrinciples: function(medicineName, activePrinciples) {
        let msg = undefined;
        if ( activePrinciples.length > 1 ) {
            msg = `Los principios activos del ${medicineName} son : `;
            activePrinciples.forEach( (ap, index) => {
                msg += `el ${ap}`;
                msg += index < activePrinciples.length - 2 ? ', ' : (index < activePrinciples.length - 1 ? ', y ' : '.');
            });
        } else if ( activePrinciples.length === 1 ) {
            msg = `El principio activo del ${medicineName} es el ${activePrinciples[0]}.`;
        } else {
            msg = `El ${medicineName} no tiene principio activo.`
        }
        return msg;
    },
    /**
     * Return a sentence list medicine's side effects
     * @param {string} medicineName 
     * @param {string[]} listEffects 
     */
    sideEffects: function(medicineName, listEffects) {
        let msg = undefined;
        if ( listEffects.length > 1 ) {
            msg = `Tiene algunos efectos secundarios como `;
            listEffects.forEach( (effet, index) => {
                msg += `${effet.trim()}`;
                msg += index < listEffects.length - 2 ? ', ' : (index < listEffects.length - 1 ? ', o ' : '.');
            });
        } else if ( listEffects.length === 1 ) {
            msg = `El principal efecto secundario del ${medicineName.trim()} es ${listEffects[0].trim()}.`;
        } else {
            msg = `No tiene efecto secundario.`;
        }
        return msg;
    },
    /**
     * return a message list medicine shape and color
     * @param {string} medicineName 
     * @param { Array<{ shape: string, products: string[] }> } shapes 
     * @param { Array<{ color: string, products: string[] }> } colors 
     */
    shapeColors: function(medicineName, shapes, colors) {
        let msg = '';
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
        return msg;
    }
}

// =============================================
// Sentence structuration
// =============================================

/** Give a random link work to avoir repetitions */
const synonyms = {
    medicament: function() { return pickAnswerAtRandom(['medicación', 'medicina', 'medicamento']); },
    must: function() { return pickAnswerAtRandom(['tienes que', 'debes', 'hay que']); }
}

// =============================================
// Util methods
// =============================================

/**
 * Pick a random answer
 * @param {*} answers 
 */
const pickAnswerAtRandom = function(answers) {
    return answers[ Math.min(Math.floor(Math.random() * answers.length), answers.length - 1) ];
}

const Dictionary = require('./dictionary');
const Constants = require('./../../../Constants');
const Utils = require('./../../../Utils').Utils;

// =============================================
// Translation objects that construct sentences.
// They are called by their respective scenarios
// =============================================

exports.General = {
    and: function() { return 'y'; },
    momentOfDay: function(moment) { return Dictionary[moment]; },
    continue: function() {
        return pickAnswerAtRandom(['¿Quieres hacer algo más?', '¿Puedo ayudarte en otra cosa?', '¿Necesitas algo más? ']);
    },
    workInProgress: function() {
        return 'Este functionalidad no es lista . ¿Quieres hacer otra cosa? ';
    }
}

exports.AlexaCancel = {
    cancel: function() { return 'Vale. ¿Qué quieres más? '}
}

exports.AlexaLaunch = {
    title: function() { return 'Bienvenido a la skill de Asistencia Parkinson. '; },
    text: function() { return 'Di “Mi Medicación” o “Llamar” '; },
    say: function() { return 'Queremos ofrecerte toda la información sobre tu medicación. Di “Mi Medicación” o “Llamar” '; },
    reprompt: function() { return 'Di “Mi Medicación”, “Llamar” o pregúntame “¿Qué puedo hacer?” '; }
}

exports.AlexaStop = {
    stop: function() { return 'Vale. Detengo la Skill. '}
}

exports.Confirmation = {
    confirmation: function() { return '¿Quieres cerrar la skill de medicación? '}
}

exports.AlexaHelp = {
    title: function() { return 'Ayuda'; },
    text: function() { return '¿Qué quieres hacer? Di "¿Qué puedo hacer?" para ver todas las opciones. '; },
    help: function() { return '¿Qué quieres hacer? Di "¿Qué puedo hacer?" para ver todas las opciones. '; },
    reprompt: function() { return 'Dime lo que quieres hacer. '; }
}


exports.ParkinsonOptions = {
    title: function() { return 'Puedes por ejemplo'; },
    calendar: function() { return 'Puedes crear un calendario de medicación. Di por ejemplo “Tengo que tomar una nueva medicación”. '; },
    medication: function() { return 'Puedes preguntar qué medicación tienes ya en tu calendario. Diciendo por ejemplo “¿Qué medicamentos tengo que tomar hoy?”. '; },
    information: function() { return 'También puedes obtener información sobre cualquier medicación relacionada con el Parkinson. Di por ejemplo: “Efectos secundarios del Sinemet”. '; },
    call: function() { return 'Además puedes llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación”. '; },
    reprompt: function() { return 'Di "Más opciones" para saber más. '; },
}

exports.Call = {

}

exports.MedicationCalendar = {
    momentMedication: {
        title: function(day, moment) { return `Tu medicación para ${ Dictionary[day] } ${ Dictionary[moment] }`; },
        say: function(moment, treatment) {
            treatment = treatment.map( t => t.quantity + ' ' + t.medicine.product );
            saidTreament = treatment.slice(0, treatment.length - 1).join(', ');
            saidTreament = saidTreament !== '' ?
                [saidTreament, treatment[ treatment.length - 1 ]].join(`, y `) :
                treatment[ treatment.length - 1 ];
            return `Por la ${ Dictionary[moment] }, ${ synonyms.must() } tomar ${ saidTreament } . `.split('/').join(' barra ');
        },
        text : function(moment, treatment) {
            treatment = treatment.map( t => t.quantity + ' ' + t.medicine.product );
            return `${ Dictionary[moment] } : ${ treatment.join(', ') }.`
        }
    },
    dayMedication: {
        title: function(day) {
            return `Tu medicación para ${ Dictionary[day] }`;
        },
        say: function(calendar) { 
            let text = '';
            Object.keys(calendar).forEach( m => {
                text += exports.MedicationCalendar.momentMedication.say(m, calendar[m]);
            });
            return text;
        },
        text : function(calendar) {
            let text = '';
            Object.keys(calendar).forEach( m => {
                text += exports.MedicationCalendar.momentMedication.text(m, calendar[m]);
            });
            return text;
        }
    },
    noMedicationOnMoment: function(moment) { return `No ${ synonyms.must() } tomar ${ synonyms.medicament() } esta ${ Dictionary[moment] } . ` },
    noMedicationOnDay: function() { return `No ${ synonyms.must() } tomar ${ synonyms.medicament() } este día . ` },
    error: function() { return 'No puedo leer tu calendario. ¿Te puedo ayudar de alguna otra manera ? ' }
}

exports.MedicationInsertion = {
    doSearch: function(medicineName) { return `Quieres que hace una búsqueda sobre "${medicineName}" ? `},
    addedToCalendar: function() { return `Medicamento añadido a tu calendario . `},
    medicineMultipleTitle: function(medicineName) { return `Medicaciones que corresponden a "${medicineName.trim()}"`},
    medicineMultipleFound: function(medicine, exemples) { 
        return `Tengo mas de un medicamento que se llaman "${ medicine }" . Puede ser mas specifico ? ` +
        `Por ejamplo, conozco el ${exemples[0].product}, o el ${exemples[1].product}.`.split('/').join(' barra ');
    },
    medicineNotFound: function(medicine) { return `Después de buscar, no pude encontrar un medicamento que se llama "${ medicine }" . Dime el nombre de la medication, por favor.`}
}

exports.MedicationMenu = {
    title: function() { return "Mi medicación"; },
    text: function() { return "Ok, pregúntame por tu medicación programada. Por ejemplo di: ¿Qué medicación tengo que tomar hoy? O pregúntame “¿Qué puedo hacer?”"; },
    reprompt: function() { return "Disculpa ¿Quieres información sobre tu medicación de hoy? " },
}

exports.MedicineInformation = {
    title: function() { return 'Información de la medicación '; },
    error: function() { return 'No puedo leer las informationes. ¿Te puedo ayudar de alguna otra manera ? '; },
    noMedicationFound: function() { return 'No conozco medication con este nombre. '; },
    noInformationFound: function() { return 'No tengo información sobre este medicamento.'; },
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
     * Return an url of the medicine's image
     * @param {string} medicineName
     */
    medicineImage: function(medicineName) {
        let img = undefined;
        if (medicineName == 'permax' ) {
            img = Constants.medicineImage.permax
        } else if (medicineName == 'sinemet') {
            img = Constants.medicineImage.sinemet
        } else if (medicineName == 'stalevo') {
            img = Constants.medicineImage.stalevo
        } else if (medicineName == 'requip') {
            img = Constants.medicineImage.requip
        } else if (medicineName == 'mirapex') {
            img = Constants.medicineImage.mirapex
        } else if (medicineName == 'parlodel') {
            img = Constants.medicineImage.parlodel
        } else if (medicineName == 'carbidopa') {
            img = Constants.medicineImage.carbidopa
        }
        return img;
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

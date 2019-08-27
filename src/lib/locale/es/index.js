const Dictionary = require('./dictionary');

exports.MedicationCalendar = {
    momentMedication: function(moment, calendar) { return `Es la ${ Dictionary[moment] } . Tienes que tomar ${ calendar[moment] } . ` },
    dayMedication: function(moment, calendar) { return `Por la ${ Dictionary[moment] }, tienes que tomar ${ calendar[moment] } . ` },
    noMedicationOnMoment: function(moment) { return `No debes tomar medicación esta ${ Dictionary[moment] } . ` },
    noMedicationOnDay: function() { return 'No debes tomar medicación este día . ' }
}
module.exports = {
    help: require('./scenarios/help'),
    call: require('./scenarios/call'),
    alexa: {
        launch: require('./scenarios/alexa-launch'),
        stop: require('./scenarios/alexa-stop'),
        cancel: require('./scenarios/alexa-cancel'),
    },
    medication: {
        calendar: require('./scenarios/medication-calendar'),
        insertion: require('./scenarios/medication-insertion'),
        inventory: require('./scenarios/medication-inventory'),
        menu: require('./scenarios/medication-menu')
    },
    medicine: {
        information: require('./scenarios/medicine-information')
    },
    parkinsonOptions: require('./scenarios/parkinsonOptions'),
    parkinsonMoreOptions: require('./scenarios/parkinsonMoreOptions'),
    confirmation: require('./scenarios/confirmation')
}
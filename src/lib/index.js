module.exports = {
    help: require('./scenarios/help'),
    end: require('./scenarios/alexa-end-session'),
    medication: {
        calendar: require('./scenarios/medication-calendar'),
    },
    medicine: {
        information: require('./scenarios/medicine-information')
    }
}
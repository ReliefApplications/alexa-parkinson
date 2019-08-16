const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const momentsOfday = ['mañana', 'mediodia', 'tarde', 'noche'];

module.exports = {
    /**
     * Return current moment of this day
     * @returns {string} current moment of this day
     */
    getCurrentMomentOfDay: function() {
        let now = new Date().getHours();
        if (now < 12) return momentsOfday[0];
        if (now <= 15) return momentsOfday[1];
        if (now <= 20) return momentsOfday[2];
        return momentsOfday[3];
    },

    /**
     * Return a standard value for the moment of the day
     * @param {string} moment value to pipe, with must be an Alexa's TIME_OF_DAY id
     * @returns {string} standard moment of day
     */
    pipeMomentOfDay: function(moment) {
        switch( moment ) {
            case 'MORNING': { return momentsOfday[0]; }
            case 'AFTERNOON': { return momentsOfday[1]; }
            case 'EVENING': { return momentsOfday[2]; }
            case 'NIGHT': { return momentsOfday[3]; }
            default: { throw new Error('No reconozco este momento del dia. Puede repetir por favor.') }
        }
    },
    
    /** 
     * Return a standard value for the moment of the day
     * @param {string} day value to pipe, with must be an Alexa's DAY_OF_WEEK id
     * @throw if the day is not recognised, probably because it's not an Alexa's DAY_OF_WEEK id
     * @returns {string} standard day's name
     */
    pipeDay: function(day) {
        switch( day ) {
            case 'TODAY': { return days[ (new Date()).getDay() - 1]; }
            case 'TOMORROW': { return days[ (new Date()).getDay() % 7]; }
            default: {
                if( days.includes( day.toLowerCase() )) return day.toLowerCase();
                else throw new Error('No reconozco este dia. Puede repetir por favor.')
            }
        }
    }
}
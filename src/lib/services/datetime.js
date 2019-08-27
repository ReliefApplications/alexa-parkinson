const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const momentsOfday = ['morning', 'afternoon', 'night'];

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
            case 'NIGHT': { return momentsOfday[2]; }
            default: { return undefined; }
        }
    },
    
    /** 
     * Return a standard value for the moment of the day
     * @param {string} day value to pipe, with must be an Alexa's DAY_OF_WEEK id
     * @throws {Error} if the day is not recognised, probably because it's not an Alexa's DAY_OF_WEEK id
     * @returns {string} standard day's name
     */
    pipeDay: function(day) {
        switch( day ) {
            case 'TODAY': { return days[ (new Date()).getDay() - 1]; }
            case 'TOMORROW': { return days[ (new Date()).getDay() % 7]; }
            case 'NOW': { return days[ (new Date()).getDay() - 1]; }
            default: {
                if( days.includes( day.toLowerCase() )) return day.toLowerCase();
                else return undefined;
            }
        }
    },

    /**
     * Parse a TREATMENT_FREQUENCY to return return corresponding days
     * @param {string} slot
     * @throws {Error} if the frequency id doesn't match
     * @return {string[]} array or selected days
     */
    pipeFrequency: function(frequencyId) {
        // If the type is EACH_######, can return directly a corresponding day
        if ( frequencyId.includes('EACH_') ) return [ frequencyId.split('_')[1].toLowerCase() ];

        // If the type is ######_TIMES_A_DAY or 'DAILY', can include all days
        if ( frequencyId === 'DAILY') return days;

        // If the type is WEEKLY, choose the current day
        if ( frequencyId === 'WEEKLY' ) return [days[new Date().getDay()]];

        // Else, throw an exception
        throw new Error(`Could not associate days to the given frequency type : ${frequencyId}`);
    }
}
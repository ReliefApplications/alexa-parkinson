module.exports = {
    /**
     * Returns the id of a slot
     * @param {*} slot slot to get the id from
     * @returns {string} slot's id
     */
    getSlotId: function(slot) {
        return slot.resolutions[0].values[0].id;
    },

    /**
     * Parse an MEDICINE_INTENSITY slot to return a formated intencity
     * @param {*} slot slot to get the intensity from
     * @returns {string} parsed intensity
     */
    getIntensity: function(slot) {
        // Intensities are formatted from '##_MG' to '## mg' 
        return this.getSlotId(slot).toLowerCase().split('_').join(' ');
    },
}
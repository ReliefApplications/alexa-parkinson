module.exports = {
    getSlotId: function(slot) {
        return slot.resolutions[0].values[0].id;
    }
}
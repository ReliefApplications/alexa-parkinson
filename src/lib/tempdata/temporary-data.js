
// A in memory object where we can store some data between two requests
// TODO implement redis for this
memoryTempData = {};

module.exports = {

    saveTemporaryData:
        /**
         * 
         * @param {string} key - the key of the key-value pair 
         * @param {any} value - the value of the key-value pair 
         */
        function (key, value) {
            memoryTempData[key] = value;
        },


    getTemporaryData:
        /**
         * 
         * @param {string} key - the key to fetch 
         */
        function (key) {
            return memoryTempData[key];
        }
}
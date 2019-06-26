const mongo = require('mongodb');
const configuration = require('../../configurations').database;

module.exports = {
    /**
     * Opens the database connection according to the configuration settings
     */
    openDatabase: function () {
        return new Promise(function (resolve, reject) {
            mongo.connect(configuration.url, { useNewUrlParser: true }, function (error, client) {
                if (error !== null) {
                    reject(error);
                }
                // let db = client.db(configuration.dbname);
                resolve(client);
            });
        });
    },

    /**
     * @param {number} userId - the ASK ID of the user (taken from the request object)
     * @returns {Promise}
     */
    getUser: async function (userId) {
        // return new Promise((resolve, reject) => {

            const connection = await this.openDatabase();
            
            // Using again await to get the result and close
            // the db connection before returning the promise
            let user = await connection.db(configuration.dbname)
                .collection(configuration.schemas.user).findOne({ '_id': userId });
            
            connection.close();

            return new Promise((resolve, reject) => resolve(user));
    }
}


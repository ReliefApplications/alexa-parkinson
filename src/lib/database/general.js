/**
 * General functions for the database management
 */
const mongo = require('mongodb');
const configuration = require('../../configurations')();

module.exports = {
    /**
    * Opens the database connection according to the configuration settings
    * @returns {Promise}
    */
    openDatabase: function () {
        return new Promise(function (resolve, reject) {
            mongo.connect(configuration.database.url,
                { useNewUrlParser: true, auth: { user: configuration.database.username, password: configuration.database.password } },
                function (error, client) {
                    if (error !== null) {
                        reject(error);
                    }
                    // let db = client.db(configuration.dbname);
                    resolve(client);
                });
        });
    }
}
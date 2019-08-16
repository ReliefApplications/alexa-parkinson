/**
 * General functions for the database management
 */
const mongo = require('mongodb');
const configuration = require('../../configurations');

module.exports = {
    /**
    * Opens the database connection according to the configuration settings
    * @returns {Promise}
    */
    openDatabase: function () {
        return new Promise(function (resolve, reject) {

            // If there are both username and password into the configurations, load them both to authenticate the password
            // Otherwise, do not use any credential. Used for testing;
            let optionObject = (configuration.database.username === undefined || configuration.database.password === undefined) ? 
                { useNewUrlParser: true } :
                { useNewUrlParser: true, auth: { user: configuration.database.username, password: configuration.database.password }};

            mongo.connect(configuration.database.url,
                optionObject,
                function (error, client) {
                    if (error !== null) {
                        reject(error);
                    }
                    // let db = client.db(configuration.dbname);
                    resolve(client);
                }
            );
        });
    }
}

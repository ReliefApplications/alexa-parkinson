const mongo = require('mongodb');
const configuration = require('../../configurations')();
const utils = require('../../Utils').Utils;
const generalDatabase = require('./general');

module.exports = {
    /**
     * Takes a user from his ASK Id
     * 
     * @param {number} askId - the ASK ID of the user (taken from the request object)
     * @returns {Promise}
     */
    getUser: async function (askId) {
        // return new Promise((resolve, reject) => {

        const connection = await generalDatabase.openDatabase();

        // Using again await to get the result and close
        // the db connection before returning the promise
        let user = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.user).findOne({ '_id': askId });

        connection.close();

        return new Promise((resolve, reject) => resolve(user));
    },

    /**
     * Save a user into the database
     * @param {string} askId - ASK Id of the user
     * @param {string} name - The name provided by the 'Registration' intent
     */
    addNewUser: async function (askId, name) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.user).insertOne(
                {
                    _id: askId,
                    name: name,
                    medicines: []
                }
            );

        connection.close();

        return result;
    }
}


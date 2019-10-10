const Mongo = require('mongodb').MongoClient;
const configuration = require('../../configurations');
const utils = require('../../Utils').Utils;
const generalDatabase = require('./general');

module.exports = {
    /**
     * Takes a user from his ASK Id
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
    addNewUser: async function (askId) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.user).insertOne(
                {
                    _id: askId,
                    calendar: {
                        monday: {
                            // manana: []
                            // tarde: []
                            // noche: [] // medicines array
                        },
                        tuesday: {},
                        wednesday: {},
                        thursday: {},
                        friday: {},
                        saturday: {},
                        sunday: {}
                    }
                }
            );

        connection.close();
        return result;
    },

    /**
     * Save the user's stock into the database
     * @param {string} askId - ASK Id of the user
     * @param {string} name - The name provided by the 'Registration' intent
     */
    addNewUserStock: async function (askId) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.amount).insertOne(
                {
                    _id: askId,
                    stock: [
                        {
                            medicine: {},
                            cantidad: {},
                            tipo: {}
                        }
                    ]
                }
            );

        connection.close();

        return result;
    },

    /**
     * Deletele the user's scheme
     * @param {string} askId - ASK Id of the user
     * @param {string} name - The name provided by the 'Registration' intent
     */
    deleteCalendar: async function (askId) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname).collection(configuration.database.schemas.user).remove({ "_id": askId});
        connection.close();
        
        return result;
    },

    /**
     * Update user data
     * @param {*} newUser 
     */
    updateUser: async function (newUser) {
        const connection = await generalDatabase.openDatabase();

        await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.user)
            .updateOne(
                { _id: newUser._id },
                {
                    '$set': { 'calendar': newUser.calendar },
                    '$currentDate': { 'lastModified': true }
                }
            );
        connection.close();

        return newUser;
    },

    /**
     * Get user's medicines
     * @param {any} user - the user
     * @param {string} dayOfWeek - the day of the week
     * @param {string} momentOfDay - the moment of the day such as 'mañana', 'tarde', 'noche'
     */
    getUserMedicines: function(user, dayOfWeek) {
        return new Promise(async function (resolve, reject) {
            try {
                // Read data from the database to get both calendar and medicines
                const connection = await generalDatabase.openDatabase();
                let calendar = await connection.db(configuration.database.dbname)
                    .collection(configuration.database.schemas.user)
                    .aggregate([
                        { '$match': { '_id': user._id } },
                        { '$replaceRoot': { 'newRoot': '$calendar' } },
                        { '$replaceRoot': { 'newRoot': `$${dayOfWeek}` } }
                    ])
                    .toArray();
                calendar = calendar[0];
                const medicines = await connection.db(configuration.database.dbname)
                    .collection(configuration.database.schemas.medicine)
                    .find()
                    .toArray();

                Object.keys(calendar).forEach( moment => {
                    calendar[moment].map( treatment => { treatment.medicine = medicines.find( m => m._id.toString() === treatment.medicine.toString() ) });
                })

                // Return the result
                connection.close();
                resolve(calendar);
            } catch {
                reject( Error("Cannot get user's medicines from the database.") );
            }
        });
    }   
}

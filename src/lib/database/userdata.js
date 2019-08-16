const Mongo = require('mongodb').MongoClient;
const configuration = require('../../configurations');
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
    addNewUser: async function (askId) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.user).insertOne(
                {
                    _id: askId,
                    calendar: {
                        monday: {
                            // noche: [] // medicines array
                            // manana: []
                            // tarde: []
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


    updateUser: async function (newUser) {
        const connection = await generalDatabase.openDatabase();

        let result = await connection.db(configuration.database.dbname)
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
     * 
     * @param {any} user - the user
     * @param {string} dayOfWeek - the day of the week
     * @param {string} momentOfDay - the moment of the day such as 'mañana', 'tarde', 'noche'
     */
    getUserMedicines: function(user, dayOfWeek, momentOfDay) {
        return new Promise(async function (resolve, reject) {
            try {
                // Read data from the database
                const connection = await generalDatabase.openDatabase();
                const data = await connection.db(configuration.database.dbname)
                .collection(configuration.database.schemas.user)
                .aggregate([
                    { '$match': { '_id': user._id } },
                    { '$replaceRoot': { 'newRoot': '$calendar' } },
                    { '$replaceRoot': { 'newRoot': `$${dayOfWeek}` } },
                    { '$lookup': {
                        from: `medicine`,
                        localField: `${momentOfDay}.medicine`,
                        foreignField: '_id',
                        as: `medicines`
                    }}
                ])
                .toArray();

                // Map data to change medicine id with the medicine data in the treatment array
                treatments = data[0][momentOfDay] || [];
                treatments.map(treatment => {
                    treatment.medicine = data[0].medicines.find( dicoMedic => dicoMedic._id.toString() === treatment.medicine.toString());
                })

                // Return the result
                connection.close();
                resolve(treatments);
            } catch {
                reject( Error("Cannot get user's medicines from the database.") );
            }
        });
    }
    
    
}

// db.user.aggregate([ { $lookup: { from: "medicine", localField: "noche.medicine", foreignField: "_id", "as": "noche.medicine" } } ])

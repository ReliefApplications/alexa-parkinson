const mongo = require('mongodb');

const databaseConnection = require('./general');
const configuration = require('../../configurations');

module.exports = {

    /**
     * Simple function to take a medicine from its commercial name.
     * 
     * @param {string} searchInput - Commercial name of the medicine.
     */
    getMedicineByCommercialName: async function (searchInput) {
        const connection = await databaseConnection.openDatabase();

        let data = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.medicine).find(
                { 'product': { '$regex': `${searchInput}`, '$options': 'i' } }
            ).toArray();

        connection.close();

        return data;
    },

    getMedicineByFormattedName: async function (searchInput) {
        const connection = await databaseConnection.openDatabase();
        let searchRegex = searchInput;
        // let searchRegex = searchInput.replace(' ', '\\s');
        let data = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.medicine)
            .find({ 'formatted_name': { '$regex': `${searchInput}`, '$options': 'i' } })
            .toArray();

        connection.close();

        return data;
    },

    getMedicineByActivePrinciple: async function (activePrinciple) {
        const connection = await databaseConnection.openDatabase();

        let data = await connection.db(configuration.database.dbname)
            .collection(configuration.database.schemas.medicine).find(
                { 'active_principle': { '$regex': `${activePrinciple}` } }
            );

        connection.close();

        return data;
    },


    /**
     * Function that takes a medicine from a relative definition.
     * 
     * @param {string} searchInput - Generic definition or phrase to search the medicine
     */
    getMedicineByRelativeDefinition: async function (searchInput) {
        const connection = await databaseConnection.openDatabase();

        let data = await connection.db(configuration.database.dbname).collection(configuration.database.schemas.medicine).find(
            { '$text': { '$search': medicineName } },
        );

        connection.close();

        return data;
    }
}
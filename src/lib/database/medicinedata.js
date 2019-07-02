const mongo = require('mongodb');

const databaseConnection = require('./general');
const configuration = require('../../configurations');

module.exports = {

    /**
     * Simple function to take a medicine from its commercial name.
     * 
     * @param {string} searchInput - Commercial name of the medicine.
     */
    getMedicineByCommercialName: function(searchInput) {
        const connection = await databaseConnection.openDatabase();
        
        let data = await connection.collection(configuration.database.schema.medicine).find(
            {'product': { '$regex': `${searchInput}`} }
        );

        connection.close();

        return data;
    },


    /**
     * Function that takes a medicine from a relative definition.
     * 
     * @param {string} searchInput - Generic definition or phrase to search the medicine
     */
    getMedicineByRelativeDefinition: function(searchInput) {
        const connection = await databaseConnection.openDatabase();
        
        let data = await connection.collection(configuration.database.schema.medicine).find(
            {'product': { '$regex': `${searchInput}`} }
        );

        connection.close();

        return data;
    }
}
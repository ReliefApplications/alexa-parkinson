const mongo = require('mongodb');

const configuration = {
    url: 'mongodb://db:27017',
    dbname: 'parkinsonfgdssgh',
    username: 'parkinson_user',
    password: 'jkvhskjbvserj45oiheowr',
}

module.exports = {
    open: function () {
        return new Promise(function (resolve, reject) {
            mongo.connect(configuration.url, { useNewUrlParser: true }, function (error, client) {
                // client.db(configuration.dbname);
                // db.authenticate(configuration.username, configuration.password, function (error, result) {
                if (error !== null) {
                    reject(error);
                }
                console.log("CLIENT:", client);
                let db = client.db(configuration.dbname);
                resolve(db);
                // });
            });
        });
    }
}


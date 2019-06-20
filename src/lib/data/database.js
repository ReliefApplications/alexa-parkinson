const mysql = require('mysql');

exports.createConnection = function () {
    return new Promise(
        function(resolve, reject) {
            const connection = mysql.createConnection({
                host: '127.0.0.1',
                port: 4000,
                user: 'parkinson_user',
                password: 'aA12345',
                // database: 'alexa_parkinson'
            });
        
            connection.connect(
                (err) => {
                    if (err) reject(err);
                    resolve(connection);
                }
            );
        }
    )
    .then(

    )

}


exports.myMedication = function (amazonId) {

    const query = "SELECT m.name FROM user AS u\
    INNER JOIN quantity_left AS ql ON u.id = ql.user_id\
    INNER JOIN medicine AS m ON ql.medicine_id = m.id\
    WHERE u.amazon_id = ?;"

    return new Promise(
        (resolve) => connection.query(query, [amazonId],
            function (e, r, f) {
                resolve(r);
                connection.end();
            }
        ));
}


// exports.myMedication('AE6YYIV3534MRCMEMWO2AUOFBXQ3J5DCVDLRJU466ACEFHWE2XNVDIU7UWF5MD2B3TPBR6XPIT6NTEB5ADDKZMB6MQ2ZY7WFYWXBHOGOZEFXEIRE7W6IHOLSIWOKDQXMLMI4BR464YISG2KL7RU43JPID4AWTOMKAIRG6QX2FTQINTCGRDFCHQFUXYRWCXZKKE5U4WQYQMFVCE');



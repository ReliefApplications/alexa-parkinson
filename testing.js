const db = require('./src/lib/data/database');

db.createConnection()
.then(
    c =>{
        console.log("HAPPY");
        c.end();
    }
)
.catch(
    err => console.log("SAD")
)


// db.myMedication('AE6YYIV3534MRCMEMWO2AUOFBXQ3J5DCVDLRJU466ACEFHWE2XNVDIU7UWF5MD2B3TPBR6XPIT6NTEB5ADDKZMB6MQ2ZY7WFYWXBHOGOZEFXEIRE7W6IHOLSIWOKDQXMLMI4BR464YISG2KL7RU43JPID4AWTOMKAIRG6QX2FTQINTCGRDFCHQFUXYRWCXZKKE5U4WQYQMFVCE')
// .then(
//     (result) => {
//         console.log(result);
//     }
// )

const db = require('./src/lib/database/userdata');

db.open().then(
    res => console.log("OK")
).catch(
    res => console.log("NO")
).finally();
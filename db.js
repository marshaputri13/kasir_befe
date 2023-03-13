const mysql = require ("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelangganan"
})

db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("Succesfull")
    }
})

module.exports = db
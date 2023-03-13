const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const moment = require("moment")
const pelangganroute = require ("./pelanggan")
const kasirroute = require ("./kasir")
const menuroute = require ("./menu")
const transaksiroute = require ("./transaksi")


const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.use(pelangganroute)
app.use(kasirroute)
app.use(menuroute)
app.use(transaksiroute)

app.listen(9000, () => {
    console.log("sksks")
})

const express = require ("express")
const router = express.Router()
const db = require("./db")
const moment = require("moment")

router.post("/pemesanan", (req,res) => {
    let data = {
        id_kasir: req.body.id_kasir,
        id_pelanggan: req.body.id_pelanggan,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss'), // get current time
        qty: req.body.qty
    }

    let menu = JSON.parse(req.body.menu)
    let sql = "insert into pemesanan set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        
        if (error) {
            res.json({message: error.message})
        } else {

            let lastID = result.insertId
            let data = []
            for (let index = 0; index < menu.length; index++) {
                data.push([
                    lastID, menu[index].id_menu
                ])                
            }

            // create query insert detail_pelanggaran
            let sql = "insert into detail_pemesanan values ?"

            db.query(sql, [data], (error, result) => {
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})



// end-point menampilkan data pelanggaran siswa
router.get("/pemesanan", (req,res) => {
    let sql = "select pemesanan.id_menu, pemesanan.id_pelanggan,pemesanan.waktu, pelanggan.id_pelanggan, pelanggan.nama_pelanggan, kasir.id_kasir, kasir.nama_kasir " +"from pemesanan join pelanggan on pemesanan.id_pelanggan = pelanggan.id_pelanggan " + "join kasir on pemesanan.id_kasir = kasir.id_kasir"

    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pemesanan: result
            })
        }
    })
})

// end-point untuk menampilkan detail pelanggaran
router.get("/pemesanan/:id_pemesanan", (req,res) => {
    let param = { id_pemesanan: req.params.id_pemesanan}

    // create sql query
    let sql = "select menu.nama_menu menu.stok " + "from detail_pemesanan join pemesanan "+ "on menu.id_menu = detail_pemesanan.id_menu " + "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_pemesanan: result
            })
        }
    })
})


module.exports = router
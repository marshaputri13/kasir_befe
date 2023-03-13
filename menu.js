const express = require ("express")
const router = express.Router()
const db = require("./db")
const multer = require("multer")
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})
router.post("/menu", upload.single("foto_menu"), (req, res) => {
    // prepare data
    let data = {
        id_menu: req.body.id_menu,
        nama_menu: req.body.nama_menu,
        kategori: req.body.kategori,
        harga_menu: req.body.harga_menu,
        stok: req.body.stok,
        foto_menu: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into menu set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

router.get("/menu", (req, res) => {
    let sql = "select * from menu"

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                pelanggan: result
            }
        }
        res.json(response)
    })
})

router.get("/menu/:id", (req, res) => {
    let data = {
        id_menu: req.params.id
    }

    let sql = "select * from menu where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                menu: result
            }
        }
        res.json(response)
    })
})

router.post("/menu", (req, res) => {
    let data = {
        id_menu: req.body.id_menu,
        nama_menu: req.body.nama_menu,
        kategori: req.body.kategori,
        harga_menu: req.body.harga_menu,
        stok: req.body.stok
    }

    let sql = "insert into menu set ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) 
    })
})

router.put("/menu", (req,res) =>{
    let data = [
        {
            id_menu: req.body.id_menu,
            nama_menu: req.body.nama_menu,
            kategori: req.body.kategori,
            harga_menu: req.body.harga_menu,
            stok: req.body.stok
        },

        {
            id_menu: req.body.id_menu
        }
    ]
    let sql = "update menu set ? where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) 
    })
})

router.delete("/menu/:id", (req,res) => {
    let data = {
        id_menu: req.params.id
    }
    let sql = "delete from menu where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })

})

module.exports = router
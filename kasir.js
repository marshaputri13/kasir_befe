const express = require ("express")
const router = express.Router()
const db = require("./db")

const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("080822") // secret key, boleh diganti kok

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from kasir where ?"

            // set parameter
            let param = { id_kasir: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_kasir
                if (result.length > 0) {
                    // id_kasir tersedia
                    next()
                } else {
                    // jika kasir tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}


router.get("/kasir",validateToken(), (req, res) => {
    // create sql query
    let sql = "select * from kasir"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                kasir: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point akses data siswa berdasarkan id_siswa tertentu
router.get("/kasir/:id", (req, res) => {
    let data = {
        id_kasir: req.params.id
    }
    // create sql query
    let sql = "select * from kasir where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                kasir: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data siswa
router.post("/kasir", (req, res) => {

    // prepare data
    let data = {
        nama_kasir: req.body.nama_kasir,
        status_kasir: req.body.status_kasir,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql query insert
    let sql = "insert into kasir set ?"

    // run query
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
        res.json(response) // send response
    })
})

// endpoint login kasir (authentication)
router.post("/kasir/auth", (req, res) => {
    // tampung username dan password
    let param = [
        req.body.username, //username
        md5(req.body.password) // password
    ]
    
    // create sql query
    let sql = "select * from kasir where username = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_kasir), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})


// end-point mengubah data siswa
router.put("/kasir", (req, res) => {

    // prepare data
    let data = [
        // data
        {
            nama_kasir: req.body.nama_kasir,
            status_kasir: req.body.status_kasir
        },

        // parameter (primary key)
        {
            id_kasir: req.body.id_kasir
        }
    ]

    // create sql query update
    let sql = "update kasir set ? where ?"

    // run query
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
        res.json(response) // send response
    })
})

// end-point menghapus data siswa berdasarkan id_siswa
router.delete("/kasir/:id", (req, res) => {
    // prepare data
    let data = {
        id_kasir: req.params.id
    }

    // create query sql delete
    let sql = "delete from kasir where ?"

    // run query
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
        res.json(response) // send response
    })
})

module.exports = router

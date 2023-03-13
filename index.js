const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

app.get("/siswa",(req,res)=>{
    let response ={
        message: "bebas"
    }
    res.json(response)
})

app.get("/profile/:nama/:kelas/:absen",(req,res)=>{

    let nama = req.params.nama
    let kelas = req.params.kelas
    let absen = req.params.absen

    let response ={
        message: "bebas 2",
        nama : nama,
        kelas : kelas,
        absen : absen,
    }
    res.json(response)
})

app.post("/luas",(req,res)=>{

    let panjang = req.body.panjang
    let lebar = req.body.lebar
    let luas = panjang * lebar

    let response ={
        message: "menghitung",
        panjang : panjang,
        lebar : lebar,
        luas : luas
    }
    res.json(response)
})

app.post("/ekskul",(req,res)=>{

    let nama = req.body.nama
    let alamat = req.body.alamat
    let kelas = req.body.kelas
    let umur = Number(req.body.umur)
    let sekolah = req.body.sekolah

    let response ={
        message: "registrasi ekskul",
        nama : nama,
        alamat : alamat,
        kelas : kelas,
        umur : umur,
        sekolah : sekolah,
    }
    res.json(response)
})

app.listen(9000,()=>{
    console.log("xixi")
})
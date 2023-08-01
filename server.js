const express = require("express");
const mysql = require("mysql");

const konekcija = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test13072023"
})

konekcija.connect(function (err) {

    if (err) throw err;

    console.log("Konektovanje na bazu je uspelo!!!!")
})


const app = express();
const port = 3000;
app.listen(port, () => {
    console.log("server je konektovan");
})

app.use(express.json());

app.use((req,res,next)=>{

res.append('Access-Control-Allow-Origin','*');
res.append('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
res.append('Access-Control-Allow-Headers','Content-Type');
next();

});





app.post("/register", ((req, res) => {

    const { username, imePrezime, password, email } = req.body;

    konekcija.query("INSERT INTO user(username,imeprezime,password,email,rola) values(?,?,?,?,?)",
        [username, imePrezime, password, email, 0], function (err, result) {
            if (err) {

                res.json({
                    message: "Korisnik nije kreiran!",
                    data: "notok"
                })
            }
            res.json({
                message: "Korisnik je kreiran!",
                data: "ok"
            })

            console.log(result)
        })
}
))

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    konekcija.query("select *  from user where username=? and password=?", [username, password],
        function (err, result) {

            if (result.length > 0) {

                console.log(result);
                res.json({
                    message: " Usepsan login",
                    data: "ok",
                    result: result
                })
            } else {

                res.json({
                    message: " Nije dobar usernam i pass",
                    data: "notok"
                })

            }


        }

    )



})



app.get("/users", (req, res) => {
    konekcija.query("select *  from user",
        function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    message: " Usepsan upit",
                    data: "ok",
                    result: result
                })
            } else {
                res.json({
                    message: " Nije dobar usernam i pass",
                    data: "notok"
               })
           }
        }
    )
})


app.get("/user/:username", (req, res) => {

    const username = req.params.username;
    konekcija.query("select *  from user where username=?", [username],
        function (err, result) {

            if (err) throw err;
            if (result.length > 0) {

                res.json({
                    message: " Usepsan upit",
                    data: "ok",
                    result: result
                })
            } else {

                res.json({
                    message: " Nije pronadjen username!!!",
                    data: "notok"
                })

            }

        }
    )

})



app.delete("/user", (req, res) => {

    const id = req.body.id;
    console.log(id);

    konekcija.query("DELETE FROM USER WHERE ID=?", [id], function (err, result) {


        if (err) throw err;
        res.json({

            message: "Korisnik je orbisan!!!",
            data: "ok"
        })
    })
})

app.put("/user", (req, res) => {

    const { email, id } = req.body;

console.log(email,id);
    konekcija.query("UPDATE USER SET EMAIL=? WHERE ID=?", [email, id], function (err, result) {
        if (err) throw err;
        res.json({
            message: "Korisnik je azuriroa email!",
            data: "ok"
        })
    })
})
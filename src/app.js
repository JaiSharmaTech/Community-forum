const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bcryptjs = require('bcryptjs')
const crud = require("./crud")
const app = express();
const port = process.env.PORT || 8000;
const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const User = require("./models/users")
require("./db/conn");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath)

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})

//register user
app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const confpassword = req.body.confpassword;
        if (password === confpassword) {
            const userdata = new User({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                address: req.body.address,
                age: req.body.age,
                password: password,
            });



            const result = await userdata.save();
            console.log(result)
            res.send(result);
        } else {
            res.status(400).send("paswords dont match")
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

//login user
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const result = await User.findOne({ email: email });
        if (result === undefined) {
            res.status(400).send("invalid credentials");
        } else if (result.password === password) {
            res.status(200).send("valid yay")
        } else {
            res.status(400).send("invalid credentials");
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log("listening at port " + port)
})
const express = require("express");
const exphbs = require("express-handlebars");
const request = require("request");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const htmlfolder = './public/';
const fs = require('fs');
const Members = require("./models/Members.js");


var HtmlList = []

const dbURI = "mongodb+srv://UltimateSheep:Tonghtyou56@cluster0.qycns.mongodb.net/Express-database?retryWrites=true&w=majority";
mongoose.connect(dbURI)
    .then((result) => console.log("Connected " + result))
    .catch((err) => console.error(`Error! ${err}`));


function getHtml() {
    fs.readdir(htmlfolder, (err, files) => {
        if (err) return console.log(err)
        files.forEach(file => {
            HtmlList.push(path.parse(file).name);
            //   console.log(HtmlList);
        });
    });
};

// Load MongoDB before page starts
var LoadDB = (req, res, next) => {
    mongoose.connect(dbURI)
        .then((result) => {
            console.log("Connected " + result);
            return next();
        })
        .catch((err) => console.error(`Error! ${err}`));
}

// Load countries before page starts
var LoadCountries = (req, res, next) => {
    if (req.originalUrl !== "/api/app") {
        return next()
    } else {
        request('https://countriesnow.space/api/v0.1/countries', {
            json: true
        }, (err, res, body) => {
            if (err) {
                return console.log(err);
            };
            body["data"].forEach(element => {
                CountryArray.push({
                    "country": element["country"]
                });
            });
            next();
        });
    }
}

app.use(LoadCountries);
app.use(LoadDB);

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
var CountryArray = []



app.get('/api/app', (req, res) => {
    Members.find().lean()
    .then((Members) => {
        res.render('index', {
            Members,
            CountryArray,
        })
    })
    .catch(err => console.error("Error while searching all data"));
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

app.use(express.static(path.join(__dirname, "public")))
app.use("/api", require("./routes/api/routes.js"));

app.get('/:url', (req, res) => {
    const found = HtmlList.some(E => req.params.url === E);

    // console.log(found);
    if (found && req.params.url !== "Error") {
        res.sendFile(path.join(__dirname, 'public', req.params.url + ".html"));
    } else {
        res.status(404).sendFile(path.join(__dirname, "public", "Error.html"));
    }

})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening to ${PORT}`));
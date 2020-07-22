const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('resources'));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});


mongoose.connect('mongodb://localhost:27017/sprybaseHomework', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log("Connected successfully");

    const adSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true, "Every ad must have a title."]
        },
        description: {
            type: String,
            required: [true, "Every ad must have a description."]
        },
        type: {
            type: String,
            required: [true, "Every ad must have a type."]
        },
        address: {
            type: String,
            required: [true, "Every ad must have a address."]
        },
        price: {
            type: Number,
            required: [true, "Every ad must have a price."]
        },
        phone: {
            type: String,
            required: [true, "Every ad must have a contact number."]
        }
    });

    const Ad = mongoose.model('Ad', adSchema);

    app.post("/ads", (req, res) => {
        const newAd = new Ad({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            address: req.body.address,
            price: req.body.price,
            phone: req.body.phone
        });

        newAd.save((err, ad) => {
            if(err) {
                console.log(err);
            } else {
                console.log(`${ad.title} successfully added to the ads collection.`);
            }
        });

        res.redirect("/");
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});




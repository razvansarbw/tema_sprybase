const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('resources'));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/js', express.static("js"));

app.use(expressLayouts);
app.set("view engine", 'ejs');

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/create-ads", (req, res) => {
    //res.sendFile(__dirname + "/create-ad.html");
    res.render("create-ad");
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
        },
        apartmentImages: { 
            type: [String],
            required: [true, "Every ad must have an image"]
        }
    });

    const Ad = mongoose.model('Ad', adSchema);

    app.post("/ads", upload.array('apartmentImage') ,(req, res) => {
        
        let imgSources = [];

        req.files.map(file => imgSources.push(file.path));

        const newAd = new Ad({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            address: req.body.address,
            price: req.body.price,
            phone: req.body.phone,
            apartmentImages: imgSources
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

    app.get("/ads", (req, res) => {
        Ad.find((err, items) => {
            if(err) {
                console.log(err);
            } else {
                res.render('listing-ads', {ads: items});
            }
        });
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});




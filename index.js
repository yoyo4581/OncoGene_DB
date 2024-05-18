const express = require("express");
const app = express();
const mongoose = require('mongoose')
const LabelsModel = require('./models/Labels')
const QueryModel = require("./models/Query")
const GeneModel = require("./models/Genes")
const path = require('path')
require('dotenv').config()


const cors = require('cors');

app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3001);
console.log("+++++++++++++++" + app.get('port'));

mongoose.connect(process.env.DATABASE_URI,
    {
        dbName: 'Cancer_db',
    }
);

app.get("/getLabels", async (req, res) => {
    try {
        const result = await LabelsModel.find({});
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

app.get("/getIds", async (req, res) => {
    const { primaryType, secondaryType, classification, location } = req.query;
    let query = {};
    if (primaryType) query['Primary Cancer Type'] = primaryType;
    if (secondaryType) query['Secondary Cancer Type'] = secondaryType;
    if (classification) query['Classification'] = classification;
    if (location) query['Location'] = location;

    try {
        const result = await LabelsModel.find(query, '_id');
        res.json(result.map(doc => doc._id));
    } catch (err) {
        res.json(err);
    }
});


app.get("/getQuery/:id", async (req, res) => {
    try {
        const result = await QueryModel.find({ link: req.params.id });
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

app.get("/getGenes/:id", async (req, res) => {
    try {
        const result = await GeneModel.find({ link: req.params.id });
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

app.get("/getAllGenes", async (req, res) => {
    try {
        const result = await LabelsModel.find({});
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

// production script
app.use(express.static("./react-admin/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "react-admin", "build", "index.html"));
});

app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


const mongoose = require('mongoose')

const LabelSchema = new mongoose.Schema({
    Primary_Cancer_Type: {
        type: String,
        required: false,
    },
    Secondary_Cancer_Type: {
        type: String,
        required: false,
    },
    Classification: {
        type: String,
        required: false,
    },
    Location: {
        type: String,
        required: false,
    },
});

const LabelsModel = mongoose.model("Labels", LabelSchema, "Labels")
module.exports = LabelsModel;
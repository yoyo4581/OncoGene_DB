const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const GeneSchema = new mongoose.Schema({
    Abstract: {
        type: Array,
        required: false,
    },
    Body: {
        type: Array,
        required: false,
    },
    Keywords: {
        type: Array,
        required: false,
    },
    Abbreviations: {
        type: String,
        required: false,
    },
    link: {
        type: ObjectId,
        required: true,
    },
    Redundant: {
        type: ObjectId,
        required: false,
    }
});

const GeneModel = mongoose.model("Gene_data", GeneSchema, "Gene_data");
module.exports = GeneModel;

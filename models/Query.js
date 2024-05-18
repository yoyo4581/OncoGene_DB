const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const QuerySchema = new mongoose.Schema({
    UID: {
        type: String,
        required: false,
    },
    value: {
        GEO: { 
            type: String,
            required: true,
        },
        PubMedIds: { 
            type: Array,
            required: false,
        },
        title: { 
            type: String,
            required: false,
        },
    },
    Summary: {
        type: String,
        required: false,
    },
    Query_Terms: {
        type: String,
        required: false,
    },
    Method: {
        type: String,
        required: false,
    },
    link: {
        type: ObjectId,
        required: true,
    }
});

const QueryModel = mongoose.model("Query_data", QuerySchema, "Query_data");
module.exports = QueryModel;

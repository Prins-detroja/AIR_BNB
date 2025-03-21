const mongoose = require('mongoose');
const { type } = require('../schema');
const  Schema  = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Review', reviewSchema);
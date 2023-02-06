const CategoryModel = require('./categoryModel')
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Model = Schema({
    linkId: {
        required: true,
        type: String,
        unique:true
    },
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    size: [String],
    price: String,
    images: [String],
    category: [CategoryModel.schema]
})

const ParsedModel = mongoose.model('parsedModel', Model)

module.exports = ParsedModel
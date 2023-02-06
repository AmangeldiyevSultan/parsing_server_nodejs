const mongoose = require('mongoose');

const Schema = mongoose.Schema

const CatModel = Schema({
    category: {
            type: String,
            of: String
        }
    
})

const CategoryModel = mongoose.model('Category', CatModel)

module.exports = CategoryModel
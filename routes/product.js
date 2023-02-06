const express = require('express');
const ParsedModel = require('../models/parseModel');
const ProductModel = require('../models/parseModel')

const productRouter = express.Router();

productRouter.get('/api/product', async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
 

    try {
        const productModel = await ProductModel.find().skip(startIndex).limit(limit);
        res.status(200).json({
            productModel
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

productRouter.get("/api/product/", async (req, res) => {
    try{ 
        console.log(req.query.category); 
        const product = await ProductModel.find({"category.category": req.query.category});
        res.json(product);
    } catch (e){     
        res.status(500).json({error: e.message});
    } 
});

productRouter.get("/api/product/search/:title", async (req, res)=>{
    try{  
        console.log("Search");
        const productSearch = await ProductModel.find({
            title: {$regex: req.params.title, $options: "i"},
        }); 
        res.json(productSearch); 
    } catch{
        res.status(500).json({error: e.message})
    }
});


productRouter.post("/api/product/create", async (req, res) =>{
    try{
        const{linkId, title, description, size, price, images, category} = req.body
        let productModel = new ProductModel({
            linkId, 
            title,
            description,
            size,
            price, 
            images, 
            category,
          });
          console.log(productModel);
        try{
            product = await productModel.save();
            res.json(product);
        } catch (e){
            res.status(400).json({
                error: 'Invalid request data'
            });
        }
    } catch (e){
        res.status(500).json({error: e.message});
    }
})

productRouter.put('/api/product/update/:id', async (req, res)=> {
    try {
        const updateProductModel = await ProductModel.updateOne(
           {linkId: req.params.id}, 
           {$set: {title: req.body.title}}
        )
        res.status(200).json({
            updateProductModel
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

productRouter.delete("/api/product/delete/:id", async(req, res) =>{
    try{
        const result = await ProductModel.deleteOne({linkId: req.params.id});
        if(result.deletedCount == 0) {
            res.status(404).json({
                error: 'not found'
            });
        }
        res.status(200).json({
            successful: 'product deleted'
        })
    } catch{
        res.status(500).json({error: e.message})
    }
});

module.exports = productRouter
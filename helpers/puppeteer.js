const { isArguments, forEach } = require("lodash");
const puppeteer = require("puppeteer");
const CategoryModel = require('../models/categoryModel');
// const ParsedModel = require('../models/parseModel');
const express = require("express");
const ParsedModel = require("../models/parseModel");



 
async function getPageContent(url) {
    try{ 
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(url);
    
        let selector = await page.waitForSelector('.layout-categories-category.layout-categories-category--level-2');
        
        let arr = await page.evaluate(() =>{
            let urlCategories = [];
            let myUrls = document.querySelectorAll('li.layout-categories-category.layout-categories-category--level-2 > a.layout-categories-category__link');
            myUrls.forEach(element => {
            if(element != ''){
            urlCategories.push([element.href, element.text]); 
            }
        }); 
        return urlCategories;
        }, selector)
        mainUrlSubCategories = [];
        
        for(let i = 15; i < arr.length; i++) {  
            await page.goto(arr[i][0]);
            let selector = await page.waitForSelector('a.product-link.product-grid-product__link.link');
            const myArr = await page.evaluate(() => {
                let urlSubCategories = []; 
                let subCatUrl = document.querySelectorAll('a.product-link.product-grid-product__link.link')
                subCatUrl.forEach(element => {
                    urlSubCategories.push(element.href);
                });
                return urlSubCategories;  
            }, selector);
            myCatArr = [];
            for(let j = 0; j < myArr.length; j++) {
                myCatArr.push([myArr[j], arr[i][1]])
            }
            console.log(myCatArr);
            mainUrlSubCategories.push(myCatArr);
            
        } 
        for(let i = 0; i < mainUrlSubCategories.length; i++){
        
            for(let j = 0; j < mainUrlSubCategories[i].length; j++){

                console.log(mainUrlSubCategories[i][j][0]);
                let linkId = mainUrlSubCategories[i][j][0].slice(-13, -5)
                await page.goto(mainUrlSubCategories[i][j][0], {waitUntil: 'networkidle0'});
                let selector = await page.waitForSelector('img.media-image__image.media__wrapper--media');
                const model = await page.evaluate(async() => {
                    try{
                        window.scrollBy(0, window.innerHeight);
                        await new Promise(function(resolve) { 
                            setTimeout(resolve, 2000)
                        });
                        let imgListProduct = [];
                        let titleListProduct = '';
                        let priceListProduct = '';
                        let descriptionListProduct = '';
                        let sizeListProduct = [];

                        let imgProduct = document.querySelectorAll('div.media.product-detail-images__image > div > picture > img');
                        imgProduct.forEach(element => {
                            if(element.src.slice(-14) != 'background.png' )
                            imgListProduct.push(element.src);
                        }) ;

                        let titleProduct = document.querySelectorAll('div.product-detail-info__header > h1');
                        titleProduct.forEach(element => {
                            titleListProduct = element.textContent;
                        })

                        let priceProduct = document.querySelectorAll('span.price__amount > span > div > span');
                        priceProduct.forEach(element => {
                            priceListProduct = element.textContent;
                        })

                        let descriptionProduct = document.querySelectorAll('div.product-detail-description > div > div > div > p');
                        descriptionProduct.forEach(element => {
                            descriptionListProduct = element.textContent;
                        }) 

                        let sizeProduct = document.querySelectorAll('.product-size-info__main-label');
                        sizeProduct.forEach(element => {
                            
                            sizeListProduct.push(element.textContent);
                        });
                        
                        localModel = {
                            title: titleListProduct,
                            description: descriptionListProduct,
                            size: sizeListProduct,
                            price: priceListProduct, 
                            images: imgListProduct, 
                            
                        } 
                        return localModel;
                        
                    } catch (err){
                        console.log(error); 
                    } 
                    
                }, selector);
                console.log(mainUrlSubCategories[i][j][1]); 
                let catModel = new CategoryModel({
                    category: mainUrlSubCategories[i][j][1]
                })
                let currentModel = new ParsedModel({
                    linkId: linkId,
                    title: model.title,
                    description: model.description,
                    size: model.size,
                    price: model.price,
                    images: model.images,
                    category: catModel 
                })
                console.log(currentModel);
                try{
                    if(currentModel.title != '' || currentModel.description != '') 
                    await currentModel.save();
                } catch(err) {
                    if (err.code === 11000) {
                        console.log("Duplicate key error, skipping save to the database");
                    } else {
                        throw err

                    }
                }
            }

        } 

        await browser.close()
 
    } catch (err){
        throw err;
    }
  }

module.exports = getPageContent;   
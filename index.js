const chalk = require('chalk')
const cherio = require('cherio')
const puppeteer = require('puppeteer')
const express = require("express")
const mongoose = require('mongoose')


const getPageContent = require('./helpers/puppeteer')

const productRouter = require('./routes/product')


const PORT = process.env.PORT || 3000;
const app = express();

const DB =
    "mongodb://127.0.0.1:27017/endterm_parsing";
 const url = 'https://www.zara.com/kz/en/woman-mkt1000.html'



async function main(){
    try{
        
        await getPageContent(url);
        
 
    } catch (err){
        console.log(chalk.red('An error has occured \n'));
        console.log(err);
    }
}

// main()
app.use(express.json());
app.use(productRouter);

mongoose.set("strictQuery", false); 
mongoose
.connect(DB, {
})
.then(() => { 
    console.log("Connection Successful");
})
.catch((e) => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port: ${PORT}`); 
}); 

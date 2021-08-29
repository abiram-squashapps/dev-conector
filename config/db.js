const mongoose = require("mongoose");
const config = require("config");
const MONGO_URI = config.get('MONGO_URI')

const connectDB = async ( ) => {
    try {
        await mongoose.connect(MONGO_URI,{useNewUrlParser:true});
        console.log("db connected")
    } catch (error) {
        console.log(error);
        //exit the precess
        process.exit(1)
    }
}

module.exports = connectDB;
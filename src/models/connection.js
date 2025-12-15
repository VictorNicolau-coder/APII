const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conectado!")
    } catch (error) {
        console.log(`Erro ao conectar MongoDb: ${error}`)
    }
};

module.exports = connectDB;

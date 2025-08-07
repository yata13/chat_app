const mongooss = require('mongoose');

const connectDB = async ()=>{
    try{
        mongooss.connect({
            process_env_MONGO_URI,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("mongoose connect...");
    }catch(error){
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

module.exports = connectDB;
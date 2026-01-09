//Kết nối MongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    }catch(err){
        console.error("Kết nối MongoDB thất bại:",err.message);
        process.exit(1); //Dừng app nếu không kết nối được 
    }
    
}
module.exports = connectDB;
//---------Create and connect to data base--------------------------------------------- 
import mongoose from "mongoose";
import url from '../public/env.js'

function connectDB() {
    mongoose.connect(
        url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
}

export default connectDB;

// "mongodb+srv://admin-pedro:michelle8266@cluster0.pgogv.mongodb.net/todolistDB"
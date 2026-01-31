import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

export const connectDB = async () => {

    try {


        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('MongoDb Started Successfully with host : ', connectionInstance.connection.host);
        // User.create(Product)
        // console.log("success upload");



    } catch (error) {
        console.log('Error in MongoDB connection', error.message);


    }

}


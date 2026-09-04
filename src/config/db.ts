import colors from 'colors'
//ORM
import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGO_URL);
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`));
        // console.log(connection);
    }catch (error){
        console.log(colors.bgRed.white.bold(error.message))
        process.exit(1)
    }
}
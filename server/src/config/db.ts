import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        console.log(colors.magenta.bold(`MongoDB Connected: ${connection.connection.host}`));
    }catch (error) {
        console.error(colors.red.bold(`Error: ${error.message}`));
        process.exit(1);
    }
}
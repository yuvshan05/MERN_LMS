import mongoose from "mongoose"
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO}`)
        console.log(`\n MongoDB connected !! `);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
export default connectDB
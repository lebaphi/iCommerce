import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URL
const dbName = process.env.MONGODB_NAME

const connectDB = (): Promise<typeof mongoose> =>
  mongoose.connect(url, { dbName })

export default connectDB

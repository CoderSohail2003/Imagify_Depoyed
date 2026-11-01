import mongoose from 'mongoose'

let connectionPromise

mongoose.connection.on('connected', () => {
    console.log("Database connected")
})

const connectDB = async ()=>{
    if (mongoose.connection.readyState === 1) return
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured')
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, { dbName: 'imagify' })
            .finally(() => {
                connectionPromise = undefined
            })
    }

    await connectionPromise
}

export default connectDB;
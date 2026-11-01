import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        next(error)
    }
})

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => res.send('API Working'))

export default app

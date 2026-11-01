import 'dotenv/config'
import app from './app.js'
import connectDB from './config/mongodb.js'

const PORT = process.env.PORT || 4000

await connectDB()
app.listen(PORT, ()=> console.log('Server running on port -> '  + PORT ));
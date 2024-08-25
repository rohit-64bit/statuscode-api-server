const app = require('./app')
const connectDB = require('./config/db')

require('dotenv').config({
    path: './config/.env'
})

const PORT = process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Running on http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.error(`Error: ${error.message}`)
    process.exit(1)
})
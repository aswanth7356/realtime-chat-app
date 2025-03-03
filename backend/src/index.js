import express from 'express'
require('dotenv').config()
require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./config/socket')
const path = require('path')


const authRoute = require('./routes/auth.route')
const messageRoute = require('./routes/message.route')
const { server, app } = require('./config/socket')



// const app = express()


const PORT = 3000
const __dirname = path.resolve()



app.use(express.json({ limit: "20mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "20mb" }));  // Increase form data limit
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoute)
app.use("/api/messages", messageRoute)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))


    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}



server.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})


app.get('/', (req, res) => {
    res.send("Request Recieved!!")
})
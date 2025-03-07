const express = require('express')
require('dotenv').config()
require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
require('./config/socket')



const authRoute = require('./routes/auth.route')
const messageRoute = require('./routes/message.route')
const { server,app } = require('./config/socket')



// const app = express()



app.use(express.json({ limit: "20mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "20mb" }));  // Increase form data limit
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoute)
app.use("/api/messages", messageRoute)


const PORT = 3000
const _dirname=path.resolve()


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve Vite build
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
}


server.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})


app.get('/', (req, res) => {
    res.send("Request Recieved!!")
})
const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser") ; 
const mongoose = require("mongoose") ; 
require("dotenv").config();
const connectDB = require("./utils/connect") ; 
const authRoutes = require("./routes/AuthRoutes") 

const app = express(); 
const PORT = 3000 ; 

app.use(cors(
    {
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }
)) ; 

app.use("/uploads/profiles", express.static("uploads/profiles")) ; 
app.use(cookieParser());
app.use(express.json()) ; 

// Add this to your server.js after the middleware setup
app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'API routes are working!' });
});

app.use("/api/auth", authRoutes); 
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI) ; 
        app.listen(PORT, ()=> {
            console.log(`Server is listening on port ${PORT}`) ; 
        })
    } catch (error) {
        console.error("Server Startup Error", error) ; 
    }
}

start(); 

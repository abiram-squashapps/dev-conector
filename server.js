const express = require('express');

const connectDB = require('./config/db');

const cors = require("cors");

const app = express();

//app.use(cors)

//connect to database

connectDB();

// api end point

app.get('/',(req,res)=>{

    res.send('api running')

})

//init midlewear

app.use(express.json({extended:false}))

//Define routes

app.use("/api/users",require("./routes/api/users"));

app.use("/api/auth",require("./routes/api/auth"));

app.use("/api/profile",require("./routes/api/profile"));

app.use("/api/posts",require("./routes/api/posts"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server running at port ${PORT}`))
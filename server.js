const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express()

app.use(express.json())


app.get('/', (req,res)=>{
    res.json({message: "Welcome to My application FunToDo "})
})


const PORT = process.env.PORT|| 3000

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{

    console.log("Successfully connected to MongoDB")
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT}`)
    })
}
) 
.catch((error) =>{
    console.log({error})
})
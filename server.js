const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const userRouter = require('./routes/users')
const packageRouter = require('./routes/packages')
const pageRouter = require('./routes/pageEntreprises')
const hotelRouter = require('./routes/hotels')
const eventRouter = require('./routes/events')


const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: [process.env.WEB_APP_URL] }))

app.use('/auth', userRouter)
app.use('/packs', packageRouter)
app.use('/pageEntreprise', pageRouter )
app.use('/hotels', hotelRouter)
app.use('/events',eventRouter)

const TRAVELPLAN =[
    {
    _id:"1",
    name:"Hammamet"
    },
    {
        _id:"2",
        name:"Paris"
    }
    
]
app.get('/travelplan',(req,res)=>{
    return res.json(TRAVELPLAN)
   
})

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
const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const noteRoutes=require('./routes/note.route')
const db=require('./db/db')
const app=express()
app.use(express.json());
db()

app.get('/',(req,res)=>{
    console.log("home")
    res.send("home")
})

//routing middleware
app.use('/api/notes', noteRoutes)



app.listen(process.env.PORT,()=>{
    console.log("server started")
})
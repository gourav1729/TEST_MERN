const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors=require("cors")
const path=require("path")

const PORT=process.env.PORT || 3000
connectDb()

const _dirname = path.resolve()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.use(express.static(path.join(_dirname,"/food-blog-app/dist")));
app.get('*', (_,res) => {
    res.sendFile(path.resolve(_dirname,"food-blog-app", "dist", "index.html"))});


app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const connectDb = require("./config/connectionDb")
const cors = require("cors")
const path = require("path")

const PORT = process.env.PORT || 3000
connectDb()

const _dirname = path.resolve()

// Serve static files from the React app
app.use(express.static(path.join(_dirname, "/food-blog-app/dist")))
app.use(express.static("public"))

app.use(express.json())
app.use(cors())

// API routes
app.use("/", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

// Handle React routing, return all requests to React app
app.get('*', (_, res) => {
  res.sendFile(path.join(_dirname, '/food-blog-app/dist/index.html'))
})

app.listen(PORT, (err) => {
  console.log(`app is listening on port ${PORT}`)
})
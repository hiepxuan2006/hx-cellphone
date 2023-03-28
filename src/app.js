const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const passport = require("passport")
const session = require("express-session")
var cors = require("cors")
require("dotenv").config()
const app = express()
app.use(cors())
const PORT = process.env.PORT || 3000
// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "bla bla bla",
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, "/../", "public")))
// setTimeout(async () => {
//   // await require("./connection/db").connectDB()
//   // await require("./connection/redisConnection").connectRedis()
//   app.use("/api/manager", require("./app.routes"))
//   app.use(require("./app.routes"))
// }, 0)
app.get("/", (req, res) => {
  return res.send("hello")
})

app.listen(PORT, function () {
  console.log("Server started on PORT " + PORT)
})

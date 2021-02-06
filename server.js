if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require("express")
const app = express()

const mongoose= require("mongoose")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const passport = require("passport")
const methodOverride = require("method-override")
const session = require("express-session");
const flash = require("connect-flash")
const validator = require("express-validator")
const MongoStore = require("connect-mongo")(session)
const index = require("./routes/index")


app.set("view engine", "ejs")
app.set("layout", "layouts/layout")

app.use(methodOverride("_method"))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({limit:"10mb",extended:false}))
app.use(express.static("public"))
app.use(session({
    secret:"mysupersecret", 
    resave:false,
     saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:180 * 60 * 1000}
}))

require("./config/passport")
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(validator())

mongoose.connect(process.env.DATABASE_URL,{
    useUnifiedTopology:true, useNewUrlParser:true
});

const db= mongoose.connection
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('Connected to mongoose'));

app.use("/", index)

app.listen(process.env.PORT|| 9000)
console.log("listening to port 9000")
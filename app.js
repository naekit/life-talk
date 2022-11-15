const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const connectDb = require('./config/db')

// load config
dotenv.config({ path: './config/config.env' })
// passport config
require('./config/passport')(passport)
const CONNECT = process.env.CONNECT

connectDb()

const app = express()

// body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// handlebars - set view engine
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// sessions
app.use(session({
    secret: 'kherson11',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: CONNECT })
}))


// passport middleware
app.use(passport.initialize())
app.use(passport.session())
// static folder
app.use(express.static(path.join(__dirname, 'public')))


// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const PORT = process.env.PORT || 8080

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
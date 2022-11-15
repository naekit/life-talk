const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')

const connectDb = require('./config/db')

// load config
dotenv.config({ path: './config/config.env' })
connectDb()

const app = express()
// logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// handlebars - set view engine
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// static folder
app.use(express.static(path.join(__dirname, 'public')))


// routes
app.use('/', require('./routes/index'))



const PORT = process.env.PORT || 8080

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
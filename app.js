var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(express)
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/ilove'

mongoose.connect(dbUrl)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')

app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'))

console.log('ilove started on port ' + port)


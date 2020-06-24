const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const user = require('./models/user')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true} )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// http://localhost:3000/api/exercise/log?userId=mark&from=earlier&to=later&limit=10
app.get('/api/exercise/log:userId?:from?:to?:limit?', (req, res) => {
  console.log("Let's get the log");
  console.log('user', req.query.userId)
  console.log('from', req.query.from)
  console.log('to', req.query.to)
  console.log('limit', req.query.limit)
})

app.post('/api/exercise/new-user', (req, res, next) => {
  let newUser = new user({name: req.body.username})
  
  newUser.save()
        .then(d => res.json({username: d.name, _id: d._id}))
        .catch(e => next(e))
})

app.post('/api/exercise/add', (req, res) => {
  console.log("Let's add an exercise")
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

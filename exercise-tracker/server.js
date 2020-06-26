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

app.get('/api/exercise/log:userId?:from?:to?:limit?', (req, res, next) => {
  let fromDate = req.query.from ? new Date(req.query.from) : new Date('1920-1-1')
  let toDate = req.query.to ? new Date(req.query.to) : new Date()

  user.aggregate([
        { $match: {'_id': mongoose.Types.ObjectId(req.query.userId)} },
        { $match: {'exercises.date': {$gte: fromDate, $lte: toDate}} }, 
        { $unwind: '$exercises'}, 
        { $match: {'exercises.date': {$gte: fromDate, $lte: toDate}} }
      ])
      .project({
        _id: 0,
        desc: '$exercises.description', 
        duration: '$exercises.duration', 
        date: '$exercises.date'
      })
      .then(async result => {
        let arr = result.slice(0, req.query.limit || result.length)
        let resObj = {
          userId: req.query.userId,
          count: result.length,
          log: result
        }
        res.json(resObj)
      })
      .catch(err => next(err))
})

app.get('/api/exercise/users', (req, res, next) => {
  user.find({}, (err, people) => {
    if (err) next(err)
    let users = []
    for (person in people) {
      let curr = people[person]
      users.push({username: curr.name, _id: curr._id})
    }
    res.json({users})
  })
})

app.post('/api/exercise/new-user', (req, res, next) => {
  let newUser = new user({name: req.body.username})
  
  newUser.save()
        .then(d => res.json({username: d.name, _id: d._id}))
        .catch(e => next(e))
})


app.post('/api/exercise/add', (req, res, next) => {
  user.findById(req.body.userId, (err, currUser) => {
    if (err) next(err)
    let date = req.body.date
    currUser.exercises.push({
          description: req.body.description,
          duration: req.body.duration,
          date: date ? new Date(req.body.date) : new Date()
    })
    currUser.save()
            .then(d => res.json(d))
            .catch(err => next(err))
  })
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

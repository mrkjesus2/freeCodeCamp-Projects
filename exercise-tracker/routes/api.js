const user = require('../models/user')
const mongoose = require('mongoose')
const route = require('express').Router()

route.get('/log:userId?:from?:to?:limit?', (req, res, next) => {
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
            log: arr
          }
          res.json(resObj)
        })
        .catch(err => next(err))
  })
  
  route.get('/users', (req, res, next) => {
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
  
  route.post('/new-user', (req, res, next) => {
    let newUser = new user({name: req.body.username})
    
    newUser.save()
          .then(d => res.json({username: d.name, _id: d._id}))
          .catch(e => next(e))
  })
  
  
  route.post('/add', (req, res, next) => {
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

  module.exports = route
'use strict';

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const URL = require('./models/url')
require('dotenv').config()

// Basic Configuration 
let app = express();
app.use(cors());

try {
  mongoose.connect(process.env.MONGO_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true})
  } catch {
    console.error("Can't make initial connection to Database");
  }

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))


getShortUrl: () => {
  // Get UTF-16 decimal representation
  let getNum = () => Math.floor(Math.random() * 93 + 33)
  let urlLength = 6
  let url = ''
  
  for (let i = 0; i < urlLength; i++) {
      url += String.fromCharCode(getNum())
  }
  
  return url
}

// Routing
app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: true}), 
  async (req, res) => {
    let path = req.headers.host + req.path + '/'
    let fullVal = req.body.url
        
    //  Make sure the fullUrl doesn't exist already
    let found = await URL.find({fullUrl: fullVal}, (err, doc) => {
      if (err) console.error(err)
      return doc
    })

    if (found[0]) {
      res.json({
        fullUrl: found[0].fullUrl, 
        shortUrl: found[0].shortUrl
      })
    } else { // Add to database if it doesn't have an entry
      let shortVal = getShortUrl()
      let newUrl = new URL({fullUrl: fullVal, shortUrl: shortVal})
      
      newUrl.save()
        .then(() => res.json( {fullUrl: fullVal, shortUrl: path + shortVal} ))
        .catch(() => res.json( {error: "Invalid URL"} ))

    }
})

app.get('/api/shorturl/:urlid?', async (req, res) => {
  let found = await URL.find({shortUrl: req.params.urlid}, (err, obj) => {
    if (err) return err
    return obj
  })
  
  res.redirect(found[0].fullUrl)
})

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Start the app
app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
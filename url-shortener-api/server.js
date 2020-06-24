'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const URL = require('./models/url')
const getShortUrl = require('./helpers/getShortUrl')
const isValidUrl = require('./helpers/isValidUrl')
const url = require('./helpers/url')
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
db.once('open', function() {
  console.log('We have a database')
})


let findByShortUrl = async (val) => {
  let found = await URL.find({shortUrl: val}, (err, obj) => {
    if (err) return err
    return obj
  })
  return found
}

let handleUrlPost = async (req) => {
  let fullVal = req.body.url

  //  Make sure the fullUrl doesn't exist already
  let found = await URL.find({fullUrl: fullVal}, (err, link) => {
    if (err) console.error(err)
    return link
  })

  if (found[0]) {
    return found[0]
  } else { // Add to database if it doesn't have an entry
    let shortVal = url.getShort()
    let newUrl = new URL({fullUrl: fullVal, shortUrl: shortVal})
    let obj = await newUrl.save()

    return obj
  }
}


// Routing
app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: true}), 
  async (req, res) => {
    let path = req.headers.host + req.path + '/'
    let isValid = await url.isValid(req.body.url)
    
    if (isValid) {  
      let obj = await handleUrlPost(req)
      
      res.json({
        orginal_url: obj.fullUrl, 
        short_url: path + obj.shortUrl
      })
    } else {
      res.json({error: "Invalid URL"})
    }
})

app.get('/api/shorturl/:urlid?', async (req, res) => {
  let found = await findByShortUrl(req.params.urlid)
  
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
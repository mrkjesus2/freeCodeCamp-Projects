'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const URL = require('./models/url')
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


// Routing
app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: true}), 
  async (req, res) => {
    let path = req.headers.host + req.path + '/'
    let isValid = await url.isValid(req.body.url)
    
    if (isValid) {  
      let obj = await url.handlePostReq(req)
      
      res.json({
        orginal_url: obj.fullUrl, 
        short_url: path + obj.shortUrl
      })
    } else {
      res.json({error: "Invalid URL"})
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
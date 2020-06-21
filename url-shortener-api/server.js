'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dns = require('dns')
const url = require('url')
const util = require('util')
const dotenv = require('dotenv').config()

const cors = require('cors');

let app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
console.log(process.env.MONGO_URI)

app.use(cors());

let getShortURL = () => {
  // Get UTF-16 decimal representation
  let getNum = () => Math.floor(Math.random() * 93 + 33)
  let urlLength = 6
  let url = ''
  
  for (let i = 0; i < urlLength; i++) {
    url += String.fromCharCode(getNum())
  }
  
  return url
}


let isValidURL = async (bodyURL) => {
  let dnsLookup = util.promisify(dns.lookup)
  let parsed = url.parse(bodyURL).hostname
  let result = dnsLookup(parsed)

  let valid = result
    .then(result => true)
    .catch(err => {
      // TODO# Add error to database?
      return false
    })

  return valid
}

app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: true}), 
  async (req, res) => {
    let path = req.headers.host + req.path + '/'
    let isValid = await isValidURL(req.body.url)
    
    if (isValid) {
      let short = getShortURL()
      // Add to Database
      //  Make sure the shortened url doesn't exist already
      res.json({orginal_url: req.body.url, short_url: path + short})
    } else {
      res.json({error: "Invalid URL"})
    }
})

app.get('/api/shorturl/:urlid?', (req, res) => {
  // Lookup url in database
  // Redirect to URL target
  res.json({message: req.params.urlid})
})

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
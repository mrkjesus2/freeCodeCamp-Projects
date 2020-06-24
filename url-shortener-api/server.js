'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dns = require('dns')
const url = require('url')
const util = require('util')
const cors = require('cors')
const URL = require('./models/url')
const getShortUrl = require('./helpers/getShortUrl')
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

// const urlSchema = new mongoose.Schema({
//   fullUrl: {type: String, required: true},
//   shortUrl: {type: String, required: true}
// })


// const URL = mongoose.model('URL', urlSchema)

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
    let shortVal = getShortUrl()
    let newUrl = new URL({fullUrl: fullVal, shortUrl: shortVal})
    let obj = await newUrl.save()

    return obj
  }
}
console.log(getShortUrl())

// Helpers
// let getShortURL = () => {
//   // Get UTF-16 decimal representation
//   let getNum = () => Math.floor(Math.random() * 93 + 33)
//   let urlLength = 6
//   let url = ''
  
//   for (let i = 0; i < urlLength; i++) {
//     url += String.fromCharCode(getNum())
//   }
  
//   return url
// }


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

// Routing
app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: true}), 
  async (req, res) => {
    let path = req.headers.host + req.path + '/'
    let isValid = await isValidURL(req.body.url)
    
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
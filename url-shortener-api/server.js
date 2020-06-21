'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const cors = require('cors');

let app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

app.post('/api/shorturl', 
          bodyParser.urlencoded({extended: true}), 
          (req, res) => {
  console.log(req.body.url)
  // Shorten url
  // Add to Database
  // return shortened URL
  res.json({message: "Shortened URL"})
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

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
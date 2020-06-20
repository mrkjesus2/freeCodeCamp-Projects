// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

let resObj = {}
let date

let isValidTime = (req, res, next) => {
  let param = req.params.dateString

  date = param === undefined 
            ? new Date() 
            : param.match(/-/) === null
              ? new Date(parseInt(param))
              : new Date(req.params.dateString)

  let dateString = date.toUTCString()

  if (dateString === "Invalid Date") {
    res.json({error: dateString})
  } else {
    next()
  }
}

let getUnixTime = (req, res, next) => {
  resObj.unix = date.getTime()
  next()
}

let getUtcTime = (req, res, next) => {
  resObj.utc = date.toUTCString()
  next()
}

app.get("/api/timestamp/:dateString?", [isValidTime, getUnixTime, getUtcTime], (req, res) => {
  res.json(resObj)
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
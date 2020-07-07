/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      var input = req.query.input;
      var initNum = convertHandler.getNum(input);
      var initUnit = convertHandler.getUnit(input);
      var returnNum = convertHandler.convert(initNum, initUnit);
      var returnUnit = convertHandler.getReturnUnit(initUnit);
      var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      
      if (!initNum && !initUnit) {
        console.log('GET', initNum, initUnit)
        res.send('invalid number and unit')
        return
      } else if (!initNum) {
        res.send('invalid number')
        return
      } else if (!initUnit) {
        res.send('invalid unit')
        return
      } else {
        let resObj = {
          initNum,
          initUnit,
          returnNum,
          returnUnit,
          string: toString
        }

        console.log(resObj)
        res.json(resObj)
      }
    });
    
};

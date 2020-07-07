/*
*
*
*       Complete the handler logic below
*       
*       
*/

const { init } = require("../server");

function ConvertHandler() {
  var units = ['gal','l','mi','km','lbs','kg'];
  let numRegex = /[\d*.\/]/g
  let unitRegex = /[a-z+]/ig

  this.getNum = function(input) {
    let nums = input.match(numRegex) ? input.match(numRegex).join('') : '1'
    let hasSlash = nums.match(/\//g)
    let isValid = !hasSlash || hasSlash.length == 1 ? true : false

    if (hasSlash && isValid) {
      let numArray = nums.split('/')
      return parseFloat(numArray[0]) / parseFloat(numArray[1])
    }

    return isValid ? parseFloat(nums) : null
  };
  
  this.getUnit = function(input) {
    let validUnits = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];

    let unit = input.match(unitRegex).join('')

    return validUnits.indexOf(unit) === -1 ? null : unit
  };
  
  this.getReturnUnit = function(initUnit) {
    var toUnit = ['l','gal','km','mi','kg','lbs'];
    
    return toUnit[units.indexOf(initUnit)];
  };

  this.spellOutUnit = function(unit) {
    var verbose = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms']

    return verbose[units.indexOf(unit)]
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    if (initNum && initUnit) {
      switch (initUnit.toLowerCase()) {
        case 'gal':
          return initNum * galToL
        case 'l':
          return initNum / galToL
        case 'mi':
          return initNum * miToKm
        case 'km':
          return initNum / miToKm
        case 'lbs':
          return initNum * lbsToKg
        case 'kg':
          return initNum / lbsToKg
      }
    }
    return null
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let initStr = this.spellOutUnit(initUnit) 
    let retStr = this.spellOutUnit(returnUnit)
    
    return `${initNum} ${initStr} converts to ${returnNum} ${retStr}`
  };
  
}

module.exports = ConvertHandler;

/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  let numRegex = /[\d*.\/]/g
  let unit

  this.getNum = function(input) {
    let nums = input.match(numRegex) ? input.match(numRegex).join('') : '1'
    let hasSlash = nums.match(/\//g)
    let isValid = !hasSlash || hasSlash.length == 1 ? true : false

    if (hasSlash && isValid) {
      let numArray = nums.split('/')
      return parseFloat(numArray[0]) / parseFloat(numArray[1])
    }

    return isValid ? parseFloat(nums) : 'invalid number'
  };
  
  this.getUnit = function(input) {
    var result;
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var result;
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    var result;
    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    
    return result;
  };
  
}

module.exports = ConvertHandler;

import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
let translator = function() {
  let timeRegex = /\d+[:.]\d+/
  let britishToAmericanSpelling = {}

  for (const am in americanToBritishSpelling) {
    if (americanToBritishSpelling.hasOwnProperty(am)) {
      const br = americanToBritishSpelling[am]
      britishToAmericanSpelling[br] = am
    }
  }

  function replaceTime(str) {
    let prevTime = str.match(timeRegex)
    let newTime

    if (prevTime) {
      newTime = ~prevTime[0].indexOf('.') 
                ? prevTime[0].replace('.', ':') 
                : prevTime[0].replace(':', '.')
    }
      
    return prevTime ? str.replace(prevTime[0], newTime) : str
  }

  function replaceTitle(str) {
    for (const prop in americanToBritishTitles) {
      if (americanToBritishTitles.hasOwnProperty(prop)) {
        const val = americanToBritishTitles[prop];
        let idx = str.indexOf(val)

        if (idx !== -1) {
          let arr = str.split('')
          let endIdx = idx + val.length
          
          if (str[endIdx] === '.') {
            // Remove period from American Title
            let first = arr.slice(0, endIdx)
            let last = arr.slice(endIdx + 1)
            let newArr = [...first, ...last] 
            return newArr.join('')
          } else {
            // Add period to British Title
            let first = arr.slice(0, endIdx)
            let last = arr.slice(endIdx)
            let newArr = [...first, '.', ...last]
            return newArr.join('')
          }
        }
      }
    }
    return str
  }

  function replaceAmSlang(str) {
    let newStr = str

    for (const saying in americanOnly) {
      if (americanOnly.hasOwnProperty(saying)) {
        const translation = americanOnly[saying];
        // console.log(newStr)
        if (~newStr.indexOf(saying)) {
          newStr = newStr.replace(saying, translation)
        }
      }
    }

    return newStr
  }

  function replaceBrSlang(str) {
    let newStr = str

    for (const saying in britishOnly) {
      if (britishOnly.hasOwnProperty(saying)) {
        const translation = britishOnly[saying];
        // console.log(newStr)
        if (~newStr.indexOf(saying)) {
          newStr = newStr.replace(saying, translation)
        }
      }
    }

    return newStr
  }

  return ({
    toBritish: function(str) {
      let newStr = str
      
      console.log(newStr)
      newStr = replaceTime(newStr)
      console.log(newStr)
      newStr = replaceTitle(newStr)
      console.log(newStr)
      newStr = replaceAmSlang(newStr)

      return newStr
    },

    toAmerican: function() {

    }
  })
}

try {
  module.exports = translator()
} catch (e) {}

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
  }

  function replaceAmSlang() {

  }

  function replaceBrSlang() {

  }

  return ({
    toBritish: function() {
      console.log('TEST', replaceTitle('test dr test'))
      console.log('TEST', replaceTitle('test dr. test'))
    },

    toAmerican: function() {

    }
  })
}

try {
  module.exports = translator()
} catch (e) {}

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

  /**
   * 
   * @param {String} str | String to look for words that need replacing
   * @param {Object} obj | An object with the translation associative object
   */
  function replaceSpelling(str, obj) {
    let newStr = str
    for (const word in obj) {
      if (obj.hasOwnProperty(word)) {
        if (~str.indexOf(word)) {
          const translation = obj[word];
          newStr = str.replace(word, translation)
        }
      }
    }
    return newStr
  }

  /**
   * 
   * @param {String} str | String that has words to replace
   * @param {Object} obj | Object with associative object of translations
   */
  function replaceSlang(str, obj) {
    let newStr = str

    for (const saying in obj) {
      if (obj.hasOwnProperty(saying)) {
        const translation = obj[saying];
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
      
      newStr = replaceTime(newStr)
      newStr = replaceTitle(newStr)
      newStr = replaceSlang(newStr, americanOnly)
      newStr = replaceSpelling(newStr, americanToBritishSpelling)
      // console.log(replaceSpelling('test favorite test', americanToBritishSpelling))
      return newStr
    },

    toAmerican: function() {

    }
  })
}

try {
  module.exports = translator()
} catch (e) {}

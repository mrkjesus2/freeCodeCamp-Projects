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

  function replaceTitle() {

  }

  function replaceAmSlang() {

  }

  function replaceBrSlang() {

  }

  return ({
    toBritish: function() {
      console.log('REPLACE', replaceTime('test'))
    },

    toAmerican: function() {

    }
  })
}

try {
  module.exports = translator()
} catch (e) {}

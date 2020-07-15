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

  // Create British Spelling object
  let britishToAmericanSpelling = {}
  createReverseAssociation(americanToBritishSpelling, britishToAmericanSpelling)
  
  //Create British Title object
  let britishToAmericanTitles = {}
  createReverseAssociation(americanToBritishTitles, britishToAmericanTitles)

  console.log(britishToAmericanSpelling.caramelised)
  /**
   * 
   * @param {Object} origObj | Object with associative translations in prop/val
   * @param {Object} newObject | Empty object that will contain reverse associations
   */
  function createReverseAssociation(origObj, newObject) {
    for (const word in origObj) {
      if (origObj.hasOwnProperty(word)) {
        const translated = origObj[word];
        newObject[translated] = word
      }
    }
  }

  // for (const am in americanToBritishSpelling) {
  //   if (americanToBritishSpelling.hasOwnProperty(am)) {
  //     const br = americanToBritishSpelling[am]
  //     britishToAmericanSpelling[br] = am
  //   }
  // }

  /**
   * Returns a boolean - True if capitalized, False if not
   * @param {String} word | Word to determine capitalization
   */
  function isCapitalized(word) {
    // console.log('ISCAPITALIZED', word)
    let firstLtr = word[0]
    return firstLtr === firstLtr.toUpperCase() ? true : false
  }

  function capitalize(word) {
    // console.log('CAPITALIZE', word)
    let first = word[0].toUpperCase()
    let rest = word.split('').slice(1).join('')
    // console.log('CAPITALIZE', first + rest)
    return first + rest
  }

  function replacePhrase(str, orgPhrase, newPhrase) {
    let newSentence
    let idx = str.toLowerCase().indexOf(orgPhrase.toLowerCase())
    let wasCapitalized = isCapitalized(str[idx])

    if (wasCapitalized) {
      // console.log('replacePhrase', capitalize(orgPhrase), capitalize(newPhrase))
      newSentence = str.replace(capitalize(orgPhrase), capitalize(newPhrase))
    } else {
      newSentence = str.replace(orgPhrase, newPhrase)
    }

    return newSentence
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

  /**
   * 
   * @param {String} str | String to search for titles to replace
   * @param {Object} obj | Object containing associated values for titles
   */
  function replaceTitle(str, obj) {
    let newStr = str

    for (const title in obj) {
      if (obj.hasOwnProperty(title)) {
        if (~str.toLowerCase().indexOf(title.toLowerCase())) {
          const newTitle = obj[title];
          newStr = replacePhrase(str, title, newTitle)    
        }
      }
    }

    return newStr
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
          // newStr = str.replace(word, translation)
          newStr = replacePhrase(str, word, translation)
        }
      }
    }
    return newStr
  }

  function findSimilarKeys(str, obj) {
    let keys = Object.keys(obj)
    let similar = keys.filter(key => {
      // console.log('SPLIT', key.split(' '))
      let words = key.split(' ')
      // console.log(words)
      let hasAll = true

      // TODO: Should capitalization happen here
      words.forEach(word => {
        if (str.toLowerCase().indexOf(word.toLowerCase()) === -1 && words.length > 1) { 
          // console.log(word, str.indexOf(word))
          hasAll = false 
        }
      });
      return hasAll && key.includes(str.toLowerCase())
    })
    // console.log(similar)
    return similar
  }

  /**
   * 
   * @param {String} str | String that has words to replace
   * @param {Object} obj | Object with associative object of translations
   */
  function replaceSlang(str, obj) {
    let newStr = str
    let regex = /[\w-]/ 

    for (const saying in obj) {
      if (obj.hasOwnProperty(saying)) {
        const translation = obj[saying];
        let idx = newStr.toLowerCase().indexOf(saying)
        let similarKeys = findSimilarKeys(saying, obj)
        let shouldReplace = idx === 0 || !regex.test(newStr[idx - 1])

        if (~idx && similarKeys.length == 1 && shouldReplace) {
          newStr = replacePhrase(newStr.toLowerCase(), saying, translation)
        }
      }
    }
    // TODO: Should capitalization happen here
    return newStr = newStr[0].toUpperCase() + newStr.slice(1)
  }


  return ({
    toBritish: function(str) {
      let newStr = str
      
      newStr = replaceTime(newStr)
      newStr = replaceTitle(newStr, americanToBritishTitles)
      newStr = replaceSlang(newStr, americanOnly)
      newStr = replaceSpelling(newStr, americanToBritishSpelling)
      
      return newStr
    },

    toAmerican: function(str) {
      let newStr = str

      newStr = replaceTime(newStr)      
      newStr = replaceTitle(newStr, britishToAmericanTitles)
      newStr = replaceSlang(newStr, britishOnly)
      newStr = replaceSpelling(newStr, britishToAmericanSpelling)      

      return newStr
    }
  })
}

try {
  module.exports = translator()
} catch (e) {}


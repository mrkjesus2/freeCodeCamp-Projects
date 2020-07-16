import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

document.addEventListener('DOMContentLoaded', ev => {
  let trnsltBtn = document.getElementById('translate-btn')
  let clrBtn = document.getElementById('clear-btn')
  let select = document.getElementById('locale-select')
  let options = select.options

  trnsltBtn.addEventListener('click', ev => {
    let input = document.getElementById('text-input')
    let text = input.value
    translator.showTranslation(text)
  })

  clrBtn.addEventListener('click', ev => {
    translator.clearInput()
  })
  
  select.addEventListener('input', ev => {
    //Change the language setting
    translator.lang = options[options.selectedIndex].value
    console.log(translator.lang)
  })

  // Initialize the language setting
  translator.lang = options[options.selectedIndex].value
})


/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
let translator = (function() {
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

  /**
   * Returns a boolean - True if capitalized, False if not
   * @param {String} word | Word to determine capitalization
   */
  function isCapitalized(word) {
    let firstLtr = word[0]
    return firstLtr === firstLtr.toUpperCase() ? true : false
  }

  function capitalize(word) {
    let first = word[0].toUpperCase()
    let rest = word.split('').slice(1).join('')

    return first + rest
  }

  function wrap(str) {
    return `<span class="highlight">${str}</span>`
  }

  function replacePhrase(str, orgPhrase, newPhrase) {
    let newSentence
    let idx = str.toLowerCase().indexOf(orgPhrase)
    let wasCapitalized = isCapitalized(str[idx])

    if (wasCapitalized) {
      newSentence = str.replace(capitalize(str.slice(idx, idx + orgPhrase.length)), wrap(capitalize(newPhrase)) )
    } else {
      newSentence = str.replace(orgPhrase, wrap(newPhrase))
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
      
    return prevTime ? str.replace(prevTime[0], wrap(newTime) ) : str
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
          newStr = replacePhrase(str, title, newTitle )    
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
        if (~str.toLowerCase().indexOf(word)) {
          const translation = obj[word];
          // newStr = str.replace(word, translation)
          newStr = replacePhrase(str, word, wrap(translation) )
        }
      }
    }
    return newStr
  }

  function findSimilarKeys(str, obj) {
    let keys = Object.keys(obj)
    let similar = keys.filter(key => {
      let words = key.split(' ')
      let hasAll = true

      words.forEach(word => {
        if (str.toLowerCase().indexOf(word.toLowerCase()) === -1 && words.length > 1) { 
          hasAll = false 
        }
      });
      return hasAll && key.includes(str.toLowerCase())
    })

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

        // Check for preceding space unless it's the first word
        let shouldReplace = idx === 0 || !regex.test(newStr[idx - 1])

        if (~idx && similarKeys.length == 1 && shouldReplace) {
          newStr = replacePhrase(newStr, saying, wrap(translation) )
        } 
      }
    }

    return newStr
  }


  return ({
    lang: '',

    toBritish: function(str) {
      let newStr = str
      
      newStr = replaceTime(newStr)
      newStr = replaceTitle(newStr, americanToBritishTitles)
      newStr = replaceSlang(newStr, americanOnly)
      newStr = replaceSpelling(newStr, americanToBritishSpelling)
      
      // console.log('TEST', newStr)
      return newStr
    },

    toAmerican: function(str) {
      let newStr = str

      newStr = replaceTime(newStr)      
      newStr = replaceTitle(newStr, britishToAmericanTitles)
      newStr = replaceSlang(newStr, britishOnly)
      newStr = replaceSpelling(newStr, britishToAmericanSpelling)      
      
      // console.log('TEST', newStr)
      return newStr
    },

    clearInput: function() {
      const errMsg = document.getElementById('error-msg')
      const phrase = document.getElementById('translated-sentence')
      const textArea = document.getElementById('text-input')

      errMsg.innerHTML = ''
      phrase.innerHTML = ''
      textArea.value = ''
    },

    showTranslation: function(text) {
      this.clearInput()
      let output = document.getElementById('translated-sentence')
      let translated

      if (text === '') {
        console.log('Showing error')
        this.showError('Error: No text to translate.')
      } else if (this.lang === 'american-to-british') {
        console.log('To British')
        translated = this.toBritish(text)
      } else {
        console.log('To American')
        translated = this.toAmerican(text)
      }
    
      if (translated === text) {
        translated = 'Everything looks good to me!'
      }
      if (translated) {
        output.innerHTML = translated
      }
    },

    showError: function(msg) {
      let el = document.getElementById('error-msg')
      el.append(`<p>${msg}</p>`)
    },

    clearError: function() {
      
    }

  })
})()

try {
  module.exports = translator
} catch (e) {}


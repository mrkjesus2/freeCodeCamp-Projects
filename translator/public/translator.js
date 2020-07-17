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
  let britishToAmericanSpelling = createReverseAssociation(americanToBritishSpelling)
  let britishToAmericanTitles = createReverseAssociation(americanToBritishTitles)

  /**
   * Returns an object with propeties and values reversed
   * @param {Object} origObj | Object with associative translations in prop/val
   */
  function createReverseAssociation(origObj) {
    let newObj = {}
    for (const word in origObj) {
      if (origObj.hasOwnProperty(word)) {
        const translated = origObj[word];
        newObj[translated] = word
      }
    }
    return newObj
  }

  /**
   * Returns a boolean - True if capitalized, False if not
   * @param {String} word | Word to determine capitalization
   */
  function isCapitalized(word) {
    if (!word) { return false }
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

  /**
   * Case sensitve replacement of given phrase
   * Outputs new phrase with replacements wrapped in
   * <span class="highlight">[newPhrase]</span
   * 
   * @param {String} str | The string containing words to replace
   * @param {String} orgPhrase | The phrase to replace
   * @param {String} newPhrase | The phrase to include
   */
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

  /**
   * Converts time separator from : to . and vice versa
   * @param {String} str | The time to convert
   */
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
          newStr = replacePhrase(newStr, word, wrap(translation) )
        }
      }
    }
    return newStr
  }

  /**
   * Returns all keys of an object containing a string
   * @param {String} str | String to check for similar keys
   * @param {Object} obj | Object which contains keys to check
   */
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

        // Check for preceding space unless it's the first word
        let shouldReplace = idx === 0 || !regex.test(newStr[idx - 1])

        // Prevent double replacement
        let similarKeys = findSimilarKeys(saying, obj)

        if (~idx && similarKeys.length == 1 && shouldReplace) {
          newStr = replacePhrase(newStr, saying, wrap(translation) )
        }
      }
    }

    return newStr
  }


  return ({
    lang: '',

    translate: function(str) {
      let objects = {
        british: {
          titles: americanToBritishTitles,
          spelling: americanToBritishSpelling,
          slang: americanOnly
        },
        american: {
          titles: britishToAmericanTitles,
          spelling: britishToAmericanSpelling,
          slang: britishOnly
        }
      }
      let toLang = this.lang === 'american-to-british' ? 'british' : 'american'
      let newStr = str

      newStr = replaceTime(newStr)
      newStr = replaceTitle(newStr, objects[toLang].titles)
      newStr = replaceSlang(newStr, objects[toLang].slang)
      newStr = replaceSpelling(newStr, objects[toLang].spelling)
      
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

      text === ''
        ? this.showError('Error: No text to translate.')
        : translated = this.translate(text)
      
    
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

  })
})()

try {
  module.exports = translator
} catch (e) {}


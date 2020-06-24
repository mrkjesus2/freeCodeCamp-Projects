let util = require('util')
let dns = require('dns')
let url = require('url')
const URL = require('../models/url')


module.exports = {
    isValid: async (bodyUrl) => {
        let dnsLookup = util.promisify(dns.lookup)
        let parsed = url.parse(bodyUrl).hostname
        let result = dnsLookup(parsed)
      
        let valid = result
          .then(result => true)
          .catch(err => {
            // TODO# Add error to database?
            return false
          })
      
        return valid
      },

    getShort: () => {
        // Get UTF-16 decimal representation
        let getNum = () => Math.floor(Math.random() * 93 + 33)
        let urlLength = 6
        let url = ''
        
        for (let i = 0; i < urlLength; i++) {
            url += String.fromCharCode(getNum())
        }
        
        return url
    },

    handlePostReq: async function(req) {
        let fullVal = req.body.url
        
        //  Make sure the fullUrl doesn't exist already
        let found = await URL.find({fullUrl: fullVal}, (err, link) => {
          if (err) console.error(err)
          return link
        })
      
        if (found[0]) {
          return found[0]
        } else { // Add to database if it doesn't have an entry
          let shortVal = this.getShort()
          let newUrl = new URL({fullUrl: fullVal, shortUrl: shortVal})
          let obj = await newUrl.save()
      
          return obj
        }
      }
}

let util = require('util')
let dns = require('dns')
let url = require('url')

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
    }
}

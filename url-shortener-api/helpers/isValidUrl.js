let util = require('util')
let dns = require('dns')
let url = require('url')

module.exports = async (bodyUrl) => {
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
  }
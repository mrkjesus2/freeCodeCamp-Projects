const mongoose = require('mongoose')
let util = require('util')
let dns = require('dns')
let url = require('url')

const urlSchema = new mongoose.Schema({
    fullUrl: {
        type: String, 
        required: true,
        validate: {
            validator: async function(val) {
                let dnsLookup = util.promisify(dns.lookup)
                let parsed = url.parse(val).hostname
                let result = dnsLookup(parsed)

                let valid =  result
                                .then(result => true)
                                .catch(err => false)
                return valid
            },
            message: 'Invalid url'
        }
    },
    shortUrl: {type: String, required: true}
  })
  
  
module.exports = mongoose.model('URL', urlSchema)
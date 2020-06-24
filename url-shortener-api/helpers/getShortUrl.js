module.exports = () => {
    // Get UTF-16 decimal representation
    let getNum = () => Math.floor(Math.random() * 93 + 33)
    let urlLength = 6
    let url = ''
    
    for (let i = 0; i < urlLength; i++) {
      url += String.fromCharCode(getNum())
    }
    
    return url
  }
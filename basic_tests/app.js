const crypto = require('crypto')

function getData() {
    return crypto.randomBytes(20);
}

module.exports = {getData};
const crypto = require('crypto')

export const generateMD5 = (value) => {
    return crypto.createHash('md5').update(value).digest('hex')
}
const CryptoJS = require('crypto-js');
require('dotenv').config();

function encrypt(id) {
    const secretKey = process.env.SECRET_KEY;
    const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encrypted
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
        .replace(/=/g, '.');
}

module.exports = encrypt
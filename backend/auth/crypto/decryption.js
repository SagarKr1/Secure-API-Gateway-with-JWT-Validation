const CryptoJS = require('crypto-js');
require('dotenv').config();

function decryptId(encryptedId) {
    const secretKey = process.env.SECRET_KEY;
    const safeId = encryptedId
        .replace(/_/g, '/')
        .replace(/-/g, '+')
        .replace(/\./g, '=');
    const bytes = CryptoJS.AES.decrypt(safeId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = decryptId
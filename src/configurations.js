
/**
 * This file will be compressed into webpack, but the .json file won't.
 * So this function is a helper to easily get the configurations.json file even with webpack
 */
module.exports = (function() {
    const c = require('./configurations.json');
    return c;
})()
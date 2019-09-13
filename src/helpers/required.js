const _ = require('lodash');

/**
 * Check if object is valid;
 * @param {array} keys
 * @param {object} data
 */
const required = (keys, data) => new Promise((resolve, reject) => {
  for (const prop of keys) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (_.isEmpty(data[prop])) {
        if (!_.isNumber(data[prop])) {
          reject(Error(`${prop} can not be empty or null`));
        }
      }
    } else {
      reject(Error(`${prop} not exists in object`));
    }
  }
  resolve(true);
});

module.exports = required;

var _ = require('underscore');

var common = {

  /**
   * Returns a UTI time stamp formated in yyyyMMddHHmmss format.
   * @param {Date=} date A date object to compute timestamp for. If one is not provided current time is used.
   * @returns {!String} Formated time stamp.
   */
  UTCDateString : function(date) {
    /**
     * Padding lamda that will pad a number with a prefix 0 if its less then 10.
     * @param  {!Number} n Number to pad.
     * @return {!String}   Padded number
     */
    function pad(n) {
     return n < 10 ? '0' + n : n;
    }

    var date_ = date || new Date();
    
    var timeStamp = date_.getUTCFullYear();  
        timeStamp += pad(date_.getUTCMonth() +1);
        timeStamp += pad(date_.getUTCDate());
        timeStamp += pad(date_.getUTCHours());  
        timeStamp += pad(date_.getUTCMinutes());  
        timeStamp += pad(date_.getUTCSeconds());

    return timeStamp;
  }
}

/**
 * Reindexes object keys so that they are orderd.
 * 
 * @param  {!Object} object Object to order
 * @return {!Object} Reordered object.
 */
Object.sortByKeys = function(obj) {
  var keys = _.keys(obj).sort(),
      result = {};

  _.each(keys, function(value, index) {
    result[value] = obj[value];
  });

  return result;
}

module.exports = common;
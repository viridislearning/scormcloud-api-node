var assert = require("assert");
var _ = require("underscore");

var common = require("../../lib/common");

describe("Common", function(){
  describe("#sortByKeys", function(){
    it("should sort an object so that its keys are indexed in alphabetical order.", function(){
      var vector = {
        "z": 0,
        "y": 1,
        "x": 2
      };
      var orderedVectorKeys = Object.keys(Object.sortByKeys(vector));

      assert.deepEqual(orderedVectorKeys, ["x", "y", "z"]);  
    });
  });

  describe("#UTCDateString", function(){
    it("should return a UTC time stamp.", function(){
      var date = new Date();
      var timestamp = common.UTCDateString(date).toString();
      var time = {
        year: timestamp.slice(0, 4),
        month: timestamp.slice(4, 6),
        day: timestamp.slice(6, 8),
        hour: timestamp.slice(8, 10),
        minute: timestamp.slice(10, 12),
        second: timestamp.slice(12, 14)
      }

      assert.equal(time.year, date.getUTCFullYear());
      assert.equal(time.month, date.getUTCMonth() + 1);
      assert.equal(time.day, date.getUTCDate());
      assert.equal(time.hour, date.getUTCHours());
      assert.equal(time.minute, date.getUTCMinutes());
      assert.equal(time.second, date.getUTCSeconds());
    });
  });
});
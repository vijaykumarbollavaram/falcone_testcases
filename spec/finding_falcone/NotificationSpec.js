'use strict';

var rewire = require('rewire');

var app = rewire('./../../lib/Finding_falcone/application');
var Validation = app.__get__('Validation');

var Time = app.__get__('Time');

describe("Validation: ", function() {
  it("It should give error", function() {
    Validation.validate();
  });
  it("It should give error", function() {
    Validation.validate([]);
  });
  it("It should give success", function() {
    Validation.validate([1,2,3]);
  });
  it("It should give success", function() {
    Validation.validate([{}, {}, ""]);
  });
});

'use strict';

var rewire = require('rewire');

var app = rewire('./../../lib/Finding_falcone/application');
var Validation = app.__get__('Validation');

var Time = app.__get__('Time');

describe("Validation: ", function() {
  it("Positive case", function() {
    expect(Validation.validate()).toBe(false);
  });

  it("Positive case", function() {
    var array = [];
    expect(Validation.validate(array)).toBe(false);
  });

  it("It should give success", function() {
    var array = [1,2,3];
    expect(Validation.validate(array)).toBe(false);
  });
  it("It should give success", function() {
    var array = [{}, "" , 123];
    expect(Validation.validate()).toBe(false);
  });

  it("Positive case", function() {
    var array = ["One", "Two", "Three", "Four"];
    expect(Validation.validate(array)).toBe(true);
  });

  it("Positive case", function() {
    var array = [1, "Two", "Three", "Four"];
    expect(Validation.validate(array)).toBe(false);
  });
});

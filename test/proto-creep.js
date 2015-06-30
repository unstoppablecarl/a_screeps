'use strict';
var assert = require('chai').assert;

var Creep = require('./mock/creep');

describe('Creep', function() {


    describe('memory', function() {

        var creep = new Creep();
        it('role', function() {
            assert(creep.role() === 'undefined');

        });
    });

});
'use strict';

require('./harness/init.js');

var assert = require('chai').assert;

// var Job = require('../job');
var JobList = require('../job-list');

describe('Room', function() {


    describe('jobsActive', function() {

        it('room.jobsActive()', function() {
            var room = new Room();

            assert(room.jobsActive() instanceof JobList);

        });
    });

});
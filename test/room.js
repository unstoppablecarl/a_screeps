'use strict';

require('./harness/init.js');

var assert = require('chai').assert;

// var Job = require('../job');
var JobList = require('../job-list');
var JobManager = require('../job-manager');

describe('Room', function() {


    describe('jobsActive', function() {

        it('room.jobsActive()', function() {
            var room = new Room();

            assert(room.jobsActive() instanceof JobList);
            var ja = room.jobsActive();
            assert(ja === room.jobsActive());

        });
    });


    describe('jobsPending', function() {

        it('room.jobsPending()', function() {
            var room = new Room();

            assert(room.jobsPending() instanceof JobList);
            var ja = room.jobsPending();
            assert(ja === room.jobsPending());

        });
    });


    describe('jobManager', function() {

        it('room.jobManager()', function() {
            var room = new Room();

            assert(room.jobManager() instanceof JobManager);

            var ja = room.jobManager();
            assert(ja === room.jobManager());

        });
    });

});
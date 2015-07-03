'use strict';

require('./harness/init.js');

var assert = require('chai').assert;

// var Job = require('../job');
var JobList = require('../job-list');
var JobManager = require('../job-manager');

describe('Room', function() {


    describe('jobList', function() {

        it('room.jobList()', function() {
            var room = new Room();

            assert(room.jobList() instanceof JobList);
            var jobList = room.jobList();
            assert.deepEqual(jobList, room.jobList());

        });
    });

    describe('jobManager', function() {

        it('room.jobManager()', function() {
            var room = new Room();

            assert(room.jobManager() instanceof JobManager);

            var jobManager = room.jobManager();
            assert.deepEqual(jobManager, room.jobManager());

        });
    });

});
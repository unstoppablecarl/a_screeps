'use strict';

require('./harness/init.js');

var assert = require('chai').assert;

var Job = require('../job');
describe('Creep', function() {


    describe('memory', function() {

        it('creep.role()', function() {
            var creep = new Creep();

            assert(creep.role() === undefined);
            creep.role('foo');
            assert(creep.role() === 'foo');

            creep.role('bar');
            assert(creep.role() === 'bar');
        });

        it('creep.jobId()', function() {
            var creep = new Creep();

            assert(creep.jobId() === undefined);
            creep.jobId(1);
            assert(creep.jobId() === 1);

            creep.jobId(2);
            assert(creep.jobId() === 2);
        });

        it('creep.job()', function() {
            var creep = new Creep();
            var room = new Room();
            creep.room = room;

            creep.id = 99;



            assert(creep.job() === false);
            creep.jobId(1);
            assert(creep.job() === false);

            var jobData = {
                id: 2,
                type: 'harvest',
                source_id: creep.id
            };
            room.jobsActive().add(jobData);
            creep.job(jobData);

            var j = creep.job();
            assert(j instanceof Job);
            assert(j === creep.job());

        });
    });

});
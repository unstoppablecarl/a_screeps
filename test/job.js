'use strict';

require('./harness/init.js');

var assert = require('chai').assert;

var Job = require('../job');
describe('Job', function() {

    before(function(){
        Job.prototype.getObjectById = function(){
            return null;
        };
    });

    after(function(){
        Job.prototype.getObjectById = Game.getObjectById;
    });

    describe('create', function() {

        it('job.room', function() {

            var room = new Room();
            var job = new Job(room, {});

            assert.deepEqual(room, job.room);

        });

        it('job.source()', function() {

            Job.prototype.getObjectById = function(){
                return undefined;
            };

            var room = new Room();
            var memory = {
                source: {id: 1}
            };
            var job = new Job(room, memory);

            assert.deepEqual(room, job.room);

        });


        it('job.id()', function() {

            var room = {};
            var memory = {
                id: 2,
            };
            var job = new Job(room, memory);

            assert.deepEqual(2, job.id());
            assert.deepEqual(2, job.memory.id);
        });

        it('job.role()', function() {

            var room = {};
            var memory = {
                role: 'foo',
            };
            var job = new Job(room, memory);

            assert.deepEqual('foo', job.role());
            assert.deepEqual('foo', job.memory.role);
        });

        it('job.type()', function() {

            var room = {};
            var memory = {
                type: 'bar',
            };
            var job = new Job(room, memory);

            assert.deepEqual('bar', job.type());
            assert.deepEqual('bar', job.memory.type);
        });

        it('job.settings()', function() {

            var room = {};
            var memory = {
                settings: 'bar',
            };
            var job = new Job(room, memory);

            assert.deepEqual('bar', job.settings());
            assert.deepEqual('bar', job.memory.settings);
        });


        it('job.priority()', function() {

            var room = {};
            var memory = {
                priority: 'foo',
            };
            var job = new Job(room, memory);

            assert.deepEqual('foo', job.priority());
            assert.deepEqual('foo', job.memory.priority);

            job.priority('bar');

            assert.deepEqual('bar', job.priority());
            assert.deepEqual('bar', job.memory.priority);

        });

        it('job.active()', function() {

            var room = {};
            var memory = {
                active: 'foo',
            };
            var job = new Job(room, memory);

            assert.deepEqual('foo', job.active());
            assert.deepEqual('foo', job.memory.active);

            job.active('bar');

            assert.deepEqual('bar', job.active());
            assert.deepEqual('bar', job.memory.active);

        });


        it('job.sourcePendingCreation()', function() {

            var room = {};
            var memory = {
                source_pending_creation: 'foo',
            };
            var job = new Job(room, memory);

            assert.deepEqual('foo', job.sourcePendingCreation());
            assert.deepEqual('foo', job.memory.source_pending_creation);

            job.sourcePendingCreation('bar');

            assert.deepEqual('bar', job.sourcePendingCreation());
            assert.deepEqual('bar', job.memory.source_pending_creation);

            job.sourcePendingCreation(false);

            assert.deepEqual(undefined, job.sourcePendingCreation());
            assert.deepEqual(undefined, job.memory.source_pending_creation);

        });

         it('job.valid()', function() {

            var room = {};
            var memory = {};
            var job = new Job(room, memory);

            assert.deepEqual(false, job.valid(), 'invalid when !target');

            job.active(true);
            job.sourcePendingCreation(true);

            assert.deepEqual(false, job.valid(), 'invalid when acive and !sourcePendingCreation && !source');

        });




    });

});
'use strict';

require('./harness/init.js');

var assert = require('chai')
    .assert;

var Job = require('../job');
describe('Job', function() {

    before(function() {
        Job.prototype.getObjectById = function() {
            return null;
        };
    });

    after(function() {
        Job.prototype.getObjectById = Game.getObjectById;
    });

    describe('create', function() {

        it('job.room', function() {

            var room = new Room();
            var job = new Job(room, {});

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

        it('job.allocationSettings()', function() {

            var room = {};
            var memory = {
                allocation_settings: 'bar',
            };
            var job = new Job(room, memory);

            assert.deepEqual('bar', job.allocationSettings());
            assert.deepEqual('bar', job.memory.allocation_settings);
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

        it('job.sourcePendingCreationBody()', function() {

            var room = {};
            var memory = {
                source_pending_creation_body: 'foo',
            };
            var job = new Job(room, memory);

            assert.deepEqual('foo', job.sourcePendingCreationBody());
            assert.deepEqual('foo', job.memory.source_pending_creation_body);

            job.sourcePendingCreationBody('bar');

            assert.deepEqual('bar', job.sourcePendingCreationBody());
            assert.deepEqual('bar', job.memory.source_pending_creation_body);

            job.sourcePendingCreationBody(false);

            assert.deepEqual(undefined, job.sourcePendingCreationBody());
            assert.deepEqual(undefined, job.memory.source_pending_creation_body);
        });

        it('job.handler()', function() {

            var room = {};
            var memory = {
                type: 'harvester'
            };
            var job = new Job(room, memory);

            var jobHandlers = require('../job-all');

            assert.deepEqual(jobHandlers.harvester, job.handler());
        });

        it('job.age()', function() {

            var room = {};
            var memory = {
                created_at: 5,
            };
            var job = new Job(room, memory);

            job.Game.time = 10;

            assert.deepEqual(5, job.age());
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

    describe('job.source()', function() {

        after(function() {
            Job.prototype.getObjectById = function() {};
        });

        it('create not found', function() {
            var room = {};
            var memory = {
                source: {
                    id: null
                }
            };
            var job = new Job(room, memory);
            assert.deepEqual(undefined, job.source());
        });

        it('set not found', function() {
            var room = {};
            var memory = {};
            var job = new Job(room, memory);
            job.source({
                id: null
            });
            assert.deepEqual(undefined, job.source());
        });

        describe('no prevJob', function() {
            var room = {};
            var jobId;
            var sourceObj = {
                id: 11,
                job: function() {},
                jobId: function(id) {
                    jobId = id;
                }
            };

            before(function() {
                jobId = undefined;
                Job.prototype.getObjectById = function(id) {
                    if (id === 11) {
                        return sourceObj;
                    }
                };
            });

            it('creating with memory', function(){
                var memory = {
                    id: 'JOB_ID',
                    source: {
                        id: 11
                    }
                };
                var job = new Job(room, memory);
                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());

            });

            it('creating with instance', function(){
                var memory = {
                    id: 'JOB_ID',
                    source: sourceObj
                };
                var job = new Job(room, memory);

                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());
            });

            it('setting with memory', function(){
                var memory = {
                    id: 'JOB_ID',
                };
                var job = new Job(room, memory);


                assert.deepEqual(sourceObj, job.source({id: 11}));
                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());

            });

            it('setting with instance', function(){
                var memory = {
                    id: 'JOB_ID',
                };
                var job = new Job(room, memory);
                assert.deepEqual(sourceObj, job.source(sourceObj));
                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());

            });

        });

        describe('prevJob', function() {
            var room = {};
            var jobId;
            var prevJobEnded;
            var prevJob = {
                memory: {
                    id: 'PREV_JOB_ID',
                },
                end: function() {
                    prevJobEnded = true;
                }
            };
            var sourceObj = {
                id: 11,
                job: function() {
                    return prevJob;
                },
                jobId: function(id) {
                    jobId = id;
                }
            };

            before(function() {
                jobId = undefined;
                prevJobEnded = undefined;
                Job.prototype.getObjectById = function(id) {
                    if (id === 11) {
                        return sourceObj;
                    }
                };
            });

            it('creating with memory', function(){
                var memory = {
                    id: 'JOB_ID',
                    source: {
                        id: 11
                    }
                };
                var job = new Job(room, memory);

                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());
                assert.deepEqual(true, prevJobEnded);
            });

            it('creating with instance', function(){
                var memory = {
                    id: 'JOB_ID',
                    source: sourceObj
                };
                var job = new Job(room, memory);

                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());
                assert.deepEqual(true, prevJobEnded);

            });

            it('setting with memory', function(){
                var memory = {
                    id: 'JOB_ID',
                };
                var job = new Job(room, memory);
                assert.deepEqual(sourceObj, job.source({id: 11}));
                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());
                assert.deepEqual(true, prevJobEnded);
            });

            it('setting with instance', function(){
                var memory = {
                    id: 'JOB_ID',
                };
                var job = new Job(room, memory);
                assert.deepEqual(sourceObj, job.source(sourceObj));
                assert.deepEqual(jobId, job.id());
                assert.deepEqual(sourceObj, job.source());
                assert.deepEqual(true, prevJobEnded);
            });
        });
    });

    describe('job.target()', function() {

        after(function() {
            Job.prototype.getObjectById = function() {};
        });

        var room = {};
            var jobId;
            var targetObj = {
                id: 11,
                job: function() {},
                jobId: function(id) {
                    jobId = id;
                }
            };

            before(function() {
                jobId = undefined;
                Job.prototype.getObjectById = function(id) {
                    if (id === 11) {
                        return targetObj;
                    }
                };
            });


        it('create not found', function() {
            var room = {};
            var memory = {
                target: {
                    id: null
                }
            };
            var job = new Job(room, memory);
            assert.deepEqual(undefined, job.target());
        });

        it('set not found', function() {
            var room = {};
            var memory = {};
            var job = new Job(room, memory);
            job.target({
                id: null
            });
            assert.deepEqual(undefined, job.target());
        });

        it('create with memory', function() {

            var room = {};
            var memory = {
                id: 'JOB_ID',
                target: {
                    id: 11,
                }
            };
            var job = new Job(room, memory);
            assert.deepEqual(targetObj, job.target());

        });

        it('create with instance', function() {


        });


        it('set with memory', function() {


        });

        it('set with instance', function() {


        });
    });

});
'use strict';

require('./harness/init');

var assert = require('chai').assert;

var Job = require('../job');
describe('Creep', function() {

    var mockRoom = {
        jobList: function(){
            return {
                get: function(id){
                    return 'job#' + id;
                }
            };
        }
    };

    describe('memory', function() {

        it('creep.role()', function() {
            var creep = new Creep();

            assert.deepEqual(undefined, creep.role());
            creep.role('foo');
            assert.deepEqual('foo', creep.role());

            creep.role('bar');
            assert.deepEqual('bar', creep.role());
        });

        it('creep.jobId()', function() {
            var creep = new Creep();
            creep.room = mockRoom;

            assert.deepEqual(undefined, creep.jobId());
            creep.jobId(1);
            assert.deepEqual(1, creep.jobId());

            creep.jobId(2);
            assert.deepEqual(2, creep.jobId());

            assert.deepEqual('job#2', creep.job());

        });

        it('creep.job()', function() {
            var creep = new Creep();
            creep.room = mockRoom;

            creep.id = 99;
            assert.deepEqual(false, creep.job(), 'returns false when not set');

            creep.job({id: 3});

            assert.deepEqual(3, creep.jobId());
            assert.deepEqual('job#3', creep.job());

        });

        it('creep.clearJob()', function() {
            var creep = new Creep();

            creep.memory.source_of_job_id = 99;
            creep.clearJob();
            assert.deepEqual(undefined, creep.memory.source_of_job_id);


        });

        it('creep.idle()', function() {
            var creep = new Creep();

            creep.job = function(){
                return false;
            };
            assert.deepEqual(true, creep.idle());

            creep.job = function(){
                return {
                    type: function(){
                        return 'test';
                    }
                };
            };
            assert.deepEqual(false, creep.idle());


            creep.job = function(){
                return {
                    type: function(){
                        return 'idle';
                    }
                };
            };

            assert(creep.idle() === true);
        });

        it('creep.energySourceId()', function() {
            var creep = new Creep();

            assert.deepEqual(undefined, creep.energySourceId());

            creep.energySourceId(1);
            assert.deepEqual(1, creep.energySourceId());

            creep.energySourceId(false);
            assert.deepEqual(false, creep.energySourceId());


        });

        it('creep.energySource()', function() {


            var creep = new Creep();

            var prev = Game.getObjectById;

            Game.getObjectById = function(id){
                if(id){
                    return 'obj#' + id;
                }
            }
            assert.deepEqual(undefined, creep.energySource());

            creep.energySourceId(1);
            assert.deepEqual('obj#1', creep.energySource());

            // creep.energySourceId(false);
            // assert(creep.energySourceId() === false);

            Game.getObjectById = prev;
        });
    });

});
'use strict';

var jobHandlers = require('job-all');

var Job = function Job(room, memory) {

    this.room = room;
    // keep ref to task memory memory object
    var source = memory.source;
    var target = memory.target;

    memory.settings = memory.settings || {};

    this.memory = memory;

    if(source && source.id){
        this.source(source);
    }

    if(target && target.id){
        this.target(target);
    }

};

Job.prototype = {
    constructor: Job,

    // added to ease unit testing
    getObjectById: Game.getObjectById || function(){},

    id: function(){
        return this.memory.id;
    },

    type: function() {
        return this.memory.type;
    },

    role: function() {
        return this.memory.role;
    },
    source: function(value) {
        var current;
        if(
            this.memory &&
            this.memory.source &&
            this.memory.source.id
        ){
            current = this.getObjectById(this.memory.source.id);
        }

        if(value !== undefined){
            // make sure value is a creep object
            if(value.jobId === undefined){
                value = this.getObjectById(value.id);
            }
            if(!value){
                return false;
            }

            // if source has a prev job that is not this job
            var prevJob = value.job();
            if(
                prevJob &&
                prevJob.memory &&
                prevJob.memory.id !== this.memory.id
            ){
                prevJob.end();
            }
            current = value;
            this.memory.source = value;
        }

        return current;
    },

    target: function(value) {
        var current;

        if(
            this.memory &&
            this.memory.target &&
            this.memory.target.id
        ){
            current = this.getObjectById(this.memory.target.id);
        }

        // set new value
        if(value !== undefined){

            // make sure value is a game object
            if(value && value.setTargetOfJob === undefined){
                value = this.getObjectById(value.id);
            }

            if(!value || (current && current.id === value.id)){
                return;
            } else {
                if(current){
                    current.removeTargetOfJob(this.memory.id);
                }

                this.memory.target = value;
                value.setTargetOfJob(this.memory.id);
                current = value;
            }


        }
        return current;
    },

    handler: function() {
        return jobHandlers[this.memory.type];
    },

    settings: function() {
        return this.memory.settings;
    },

    priority: function(value) {
        if(value !== undefined){
            this.memory.priority = value;
        }
        return this.memory.priority;
    },

    active: function(value){
        if(value !== undefined){
            this.memory.active = value;
        }
        return this.memory.active;
    },

    sourcePendingCreation: function(value){
        if(value !== undefined){
            if(!value){
                // set undefined to remove from memory
                value = undefined;
            }
            this.memory.source_pending_creation = value;
        }
        return this.memory.source_pending_creation;
    },

    start: function(){
        var source = this.source();
        var handler = this.handler();

        if(!source){
            console.log('ERROR trying to start task without source');
        }

        if(handler.start){
            handler.start(source);
        }
        console.log('source', this, source);
        source.say(this.type());
        this.active(true);
    },

    // set as inactive, unset source, leave target
    cancel: function() {
        var type = this.type();
        if(type === 'energy_collect'){
            throw new Error('foo');
        }
        if(type === 'idle'){
            console.log('type idle');
            this.end();
            return;
        }
        var jobId = this.memory.id;
        var source = this.source();
        var target = this.target();
        var handler = this.handler();


        if(source){
            source.clearJob();

            if(handler.cancel){
                handler.cancel(source);
            }
        }

        this.memory.source = undefined;
        this.active(false);
    },

    end: function() {

        var source = this.source();
        var target = this.target();
        var handler = this.handler();

        if(source){
            source.clearJob();
            if(handler.end){
                handler.end(this.source());
            }
        }

        if(target){
            target.removeTargetOfJob(this.memory.id);
        }

        this.room.jobList().remove(this.memory.id);
    },

    valid: function(){
        // active without target
        if(!this.target()){
            return false;
        }

        // active without source;
        if(this.active() && !this.sourcePendingCreation() && !this.source()){
            return false;
        }
        return true;
    },

    toString: function(){
        return [
            '[Job#' + this.id(),
            'type:',
            this.type(),
            ', source:',
            this.source(),
            ', target:',
            this.target(),
            ']'
        ].join(' ');
    },
};




module.exports = Job;

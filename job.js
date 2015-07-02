'use strict';

var jobHandlers = require('job-all');

var Job = function Job(room, memory) {

    this.room = room;
    // keep ref to task memory memory object
    this.memory = memory;
    this.memory.settings = this.memory.settings || {};
    if(memory.source && memory.source.id){
        var source = Game.getObjectById(memory.source.id);
        this.source(source);
    }

    if(memory.target && memory.target.id){
        var target = Game.getObjectById(memory.target.id);
        this.target(target);
    }
};

Job.prototype = {
    constructor: Job,

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
        if(this.memory.source && this.memory.source.id){
            current = Game.getObjectById(this.memory.source.id);
        }

        if(value !== undefined){
            if(current){
                current.clearJob();
            }
            this.memory.source = value;
            if(value && value.jobId === undefined){
                value = Game.getObjectById(value.id);
            }
            if(value && value.jobId){
                value.jobId(this.memory.id);
            }
            current = value;
        }
        return current;
    },

    target: function(value) {
        var current;
        if(this.memory.target && this.memory.target.id){
            current = Game.getObjectById(this.memory.target.id);
        }
        if(value !== undefined){
            if(current){
                current.removeTargetOfJob(this.memory.id);
            }
            this.memory.target = value;
            if(value && value.setTargetOfJob === undefined){
                value = Game.getObjectById(value.id);
            }
            if(value && value.setTargetOfJob){
                value.setTargetOfJob(this.memory.id);
            }
            current = value;
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
        if(this.active()){
            // active without source
            if(!this.sourcePendingCreation() && !this.source()){
                return false;
            }
            // active without target
            if(!this.target()){
                return false;
            }
        } else {

            // pending without target
            if(!this.target()){
                return false;
            }
        }

        return true;
    },
};




module.exports = Job;

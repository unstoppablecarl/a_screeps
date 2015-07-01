'use strict';

var jobHandlers = require('job-all');

var Job = function Job(room, memory) {
    this.room = room;
    // keep ref to task memory memory object
    this.memory = memory;
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
        if(value !== undefined){
            this.memory.source = value;
        }
        if(this.memory.source && this.memory.source.id){
            return Game.getObjectById(this.memory.source.id);
        }
    },

    target: function() {
        if(this.memory.target && this.memory.target.id){
            return Game.getObjectById(this.memory.target.id);
        }
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

    start: function(){
        var jobId = this.memory.id;
        var source = this.source();
        var target = this.target();
        var handler = this.handler();

        if(!source){
            console.log('ERROR trying to start task without source');
        }
        source.jobId(jobId);
        target.setTargetOfJob(jobId);

        if(handler.start){
            handler.start(source);
        }

        this.active(true);
    },

    // set as inactive, unset source, leave target
    cancel: function() {
        var jobId = this.memory.id;
        var source = this.source();
        var target = this.target();
        var handler = this.handler();
        if(handler.cancel){
            handler.cancel(this.source());
        }

        source.clearJob();
        this.memory.source = undefined;
        this.active(false);
    },

    end: function() {
        var source = this.source();
        var target = this.target();
        var handler = this.handler();
        if(handler.end){
            handler.end(this.source());
        }

        source.clearJob();
        target.removeTargetOfJob(this.memory.id);
        this.room.jobList.remove(this.memory.id);
    },


    valid: function(){
        if(this.active()){
            if(!this.source()){
                return false;
            }
            if(!this.target()){
                return false;
            }
        } else {
            if(!this.source()){
                return false;
            }
        }

        return true;
    },
};




module.exports = Job;

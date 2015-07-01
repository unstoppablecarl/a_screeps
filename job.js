'use strict';

var jobHandlers = require('job-all');

var Job = function Job(room, data) {
    this.room = room;
    // keep ref to task data memory object
    this.data = data;
};

Job.prototype = {
    constructor: Job,

    id: function(){
        return this.data.id;
    },

    type: function() {
        return this.data.type;
    },

    role: function() {
        return this.data.role;
    },

    source: function() {
        if(this.data.source && this.data.source.id){
            return Game.getObjectById(this.data.source.id);
        }
    },

    target: function() {
        if(this.data.target && this.data.target.id){
            return Game.getObjectById(this.data.target.id);
        }
    },

    handler: function() {
        return jobHandlers[this.data.type];
    },

    settings: function() {
        return this.data.settings;
    },

    // priority: function() {
    //     return this.data.priority;
    // },

    start: function(){
        var jobId = this.data.id;
        var source = this.source();
        var target = this.target();
        var handler = this.handler();

        source.jobId(jobId);
        target.setTargetOfJob(jobId);

        if(handler.start){
            handler.start(source);
        }

    },

    // act: function(){
        // moved to proto-creep.js
    // },

    cancel: function() {
        var jobId = this.data.id;
        var source = this.source();
        var target = this.target();
        var handler = this.handler();
        if(handler.cancel){
            handler.cancel(this.source());
        }

        source.jobId(null);
        target.removeTargetOfJob(jobId);

        // move job to pending list
        this.room.jobsActive().remove(jobId);
        this.room.jobsPending().add(this.data);
    },

    end: function() {
        var source = this.source();
        var target = this.target();
        var handler = this.handler();
        if(handler.end){
            handler.end(this.source());
        }

        // remove all references
        source.jobId(null);
        target.removeTargetOfJob(this.data.id);
        this.room.jobsActive().remove(this.data.id);
    },
};




module.exports = Job;

'use strict';

var Job = require('job');

var JobList = function JobList(room, memoryKey){

    if(!room.memory[memoryKey]){
        room.memory[memoryKey] = {
            _id_increment: 1,
            jobs: {}
        };
    }

    this.room = room;
    this.memory = room.memory[memoryKey];
    this.memoryKey = memoryKey;
};

JobList.prototype = {
    room: null,
    memory: null,
    memoryKey: null,

    _cached: {},

    all: function(filter){
        var out = [];
        for(var id in this.memory.jobs){
            var job = this.getById(id);
            if(!filter || filter(job)){
                out.push(job);
            }
        }
        return out;
    },

    get: function(id){
        if(!this._cached[id]){
            var jobData = this.memory.jobs[id];
            if(!jobData){
                return false;
            }
            this._cached[id] = new Job(jobData);
        }
        return this._cached[id];
    },

    add: function(jobData){
        jobData.id = jobData.id || this.memory._id_increment++;
        this.memory.jobs[jobData.id] = jobData;
        return jobData;
    },

    remove: function(id){
        delete this._cached[id];
        delete this.memory.jobs[id];
    },
};



module.exports = jobList;
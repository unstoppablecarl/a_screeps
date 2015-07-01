'use strict';

var Job = require('job');

var JobList = function JobList(room, memoryKey){

    if(!room.memory[memoryKey]){
        room.memory[memoryKey] = {};
    }
    if(!room.memory[memoryKey].jobs){
        room.memory[memoryKey].jobs = {};
    }
    if(!room.memory[memoryKey]._id_increment){
        room.memory[memoryKey]._id_increment = 1;
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
            var job = this.get(id);
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
            this._cached[id] = new Job(this.room, jobData);
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

    clean: function(){
        for(var key in this.memory.jobs){

        }
    }
};

module.exports = JobList;

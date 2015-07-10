'use strict';

var Job = require('job');

var JobList = function JobList(room){

    if(!room.memory){
        room.memory = {};
    }
    if(!room.memory.jobs){
        room.memory.jobs = {};
    }
    if(!room.memory._id_increment){
        room.memory._id_increment = 1;
    }

    this.room = room;
    this.memory = room.memory;
};

JobList.prototype = {
    room: null,
    memory: null,

    _cached: {},

    maxPendingJobAge: 100,

    getObjectById: Game.getObjectById || function(){},

    getActive: function(filter){
        return this.all().filter(function(job){
            return job.active() && (!filter || filter(job));
        });
    },
    getPending: function(filter){
        return this.all().filter(function(job){
            return !job.active() && job.type() !== 'idle' && (!filter || filter(job));
        });
    },

    sortByPriority: function(jobs){
        return _.sortByOrder(jobs, [function(job){
            return job.priority();
        }], [false]);
    },

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
        var id = this.memory._id_increment++;
        jobData.id = id;
        jobData.created_at = Game.time;
        this.memory.jobs[id] = jobData;
        var job = new Job(this.room, jobData);
        this._cached[id] = job;
        return job;
    },

    addMultiple: function(jobDatas){
        for (var i = 0; i < jobDatas.length; i++) {
            var jobData = jobDatas[i];
            this.add(jobData);
        }
    },

    remove: function(id){
        delete this._cached[id];
        delete this.memory.jobs[id];
    },

    removeMultiple: function(ids){
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            this.remove(id);
        }
    },

    jobTargets: function(){
        if(this.memory.job_targets === undefined){
            this.memory.job_targets = {};
        }
        return this.memory.job_targets;
    },

    // cleanup invalid jobs
    cleanup: function(){
        var jobs = this.all();
        for (var i = 0; i < jobs.length; i++) {
            var job = jobs[i];
            if(
                !job.valid() ||
                (!job.active() && job.age() >= this.maxPendingJobAge)
            ){
                job.end();
            }
        }
        var jobTargets = this.jobTargets();
        for (var key in jobTargets){
            if(!this.getObjectById(key)){
                delete jobTargets[key];
            }
        }
    },

    reportData: function(jobs) {
        var jobData = [];
        _.each(jobs, function(job){

            // if(job.type() === 'energy_collect'){
            //     return;
            // }
            var target;
            var pos;
            jobData.push({
                id: job.id(),
                role: job.role(),
                type: job.type(),
                prior: job.priority(),
                source: job.source(),
                target: job.target(),
                allocate: JSON.stringify(job.allocationSettings()),
            });
        });

        jobData = _.sortBy(jobData, 'prior').reverse();
        return jobData;
    },

    report: function(jobs) {
        jobs = jobs || this.room.jobList().getPending();
        if(!jobs.length){
            return;
        }

        var table = require('util').table;
        var str = table(this.reportData(jobs));
        if(str){
            console.log(str);
            console.log('-');
        }
    },
};

module.exports = JobList;

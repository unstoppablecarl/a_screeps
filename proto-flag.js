'use strict';

require('mixin-job-target')(Flag.prototype);

Flag.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};



// guard
Flag.prototype.guardMax = function(value) {
    if(this.memory.role !== 'guard'){
        return false;
    }
    if (value !== undefined) {
        this.memory.guard_max = value;
    } else if(this.memory.guard_max === undefined){
        this.memory.guard_max = 5;
    }
    return this.memory.guard_max;
};

Flag.prototype.guardCount = function() {
    var jobs = this.targetOfJobs(function(job){
        return job.source();
    });
    return jobs.length;
};


// source
Flag.prototype.sourceId = function(id) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if (id !== void 0) {
        this.memory.source_id = id;
    } else if(this.memory.source_id === undefined){
        var sources = this.pos.findInRange(FIND_SOURCES, 2);
        if(sources.length){
            this.memory.source_id = sources[0].id;
        }
    }
    return this.memory.source_id;
};

Flag.prototype.harvesterId = function(id) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if (id !== void 0) {
        this.memory.harvester_id = id;
    }
    return this.memory.harvester_id;
};

Flag.prototype.harvester = function(harvester) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if (harvester !== undefined) {
        this.harvesterId(harvester.id);
    }
    return Game.getObjectById(this.harvesterId());
};

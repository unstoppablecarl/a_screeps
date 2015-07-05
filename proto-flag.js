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
    if(this.memory.role !== 'guard'){
        return false;
    }
    var jobs = this.targetOfJobs(function(job){
        if(job){
            return job.type() === 'guard';
        }
        return false;
    });
    return jobs.length;
};

// overrides base priority (0-1) for this flag only
Flag.prototype.guardPriority = function(priority) {
    if(this.memory.role !== 'guard'){
        return false;
    }
    if (priority !== void 0) {
        this.memory.guard_priority = priority;
    }
    return this.memory.guard_priority;
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


Flag.prototype.source = function(source) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if (source !== undefined) {
        this.sourceId(source.id);
    }
    return Game.getObjectById(this.sourceId());
};

Flag.prototype.havesterCountMax = function(value) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if(this.memory.harvester_count_max === undefined){
        this.memory.harvester_count_max = 3;
    }
    if (value !== undefined) {
        this.memory.harvester_count_max = value;
    }
    return this.memory.harvester_count_max;
};


// idle

// type of creeps to idle at this flag
// if not set any creep type can idle here
Flag.prototype.idleCreepRole = function(role) {
    if(this.memory.idle_creep_role !== 'idle'){
        return false;
    }
    if (role !== undefined) {
        this.memory.idle_creep_role = role;
    }
    return this.memory.idle_creep_role;
};

// max number to idle
Flag.prototype.idleCreepMax = function(value) {
    if(this.memory.role !== 'idle'){
        return false;
    }
    if (value !== undefined) {
        this.memory.idle_creep_max = value;
    }
    return this.memory.idle_creep_max;
};


// max number to idle
Flag.prototype.getCreepIdleSlots = function() {
    if(this.memory.role !== 'idle'){
        return false;
    }

    var idleCreepMax = this.idleCreepMax();

    // unlimited
    if(!_.isNumber(idleCreepMax)){
        return true;
    }

    if(idleCreepMax > 0){
        var assignedCreeps = this.targetOfJobTypeCount('idle');
        return idleCreepMax - assignedCreeps;
    }

    return 0;

};


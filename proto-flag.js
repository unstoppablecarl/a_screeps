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

// number of guards assigned to this flag
Flag.prototype.guardCount = function() {
    if(this.memory.role !== 'guard'){
        return false;
    }
    var jobs = this.targetOfJobs(function(job){
        if(job){
            var type = job.type();
            return type === 'move_to_flag' || type === 'standby';
        }
        return false;
    });
    return jobs.length;
};

// radius from flag to attack enemies within
Flag.prototype.guardRadius = function(value) {
    if(this.memory.role !== 'guard'){
        return false;
    }
    if (value !== undefined) {
        this.memory.guard_radius = value;
    } else if(this.memory.guard_radius === undefined){
        this.memory.guard_radius = 10;
    }
    return this.memory.guard_radius;
};

// get an array of assigned guards
Flag.prototype.guards = function() {
    if(this.memory.role !== 'guard'){
        return false;
    }
    return this.targetOfJobs(function(job){
        if(job){
            var type = job.type();
            return (type === 'move_to_flag' || type === 'standby') && job.source();
        }
        return false;
    }).map(function(job){
        return job.source();
    });
};

// overrides base job priority (0-1) for this flag only
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

// the max number of harvesters that can be assigned to this source
Flag.prototype.harvesterCountMax = function(value) {
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

Flag.prototype.carrierCountMax = function(value) {
    if(this.memory.role !== 'source'){
        return false;
    }
    if(this.memory.carrier_count_max === undefined){
        this.memory.carrier_count_max = 3;
    }
    if (value !== undefined) {
        this.memory.carrier_count_max = value;
    }
    return this.memory.carrier_count_max;
};


// idle

Flag.prototype.idlePriority = function(value) {
    if(this.memory.role !== 'idle'){
        return false;
    }
    if (value !== undefined) {
        this.memory.idle_priority = value;
    }
    return this.memory.idle_priority || 0;
};

// type of creeps to idle at this flag
// if not set any creep type can idle here
Flag.prototype.idleCreepRole = function(role) {
    if(this.memory.role !== 'idle'){
        return false;
    }
    if (role !== undefined) {
        this.memory.idle_creep_role = role;
    }
    return this.memory.idle_creep_role;
};

// if the creep's enegy must be full or empty to idle at this flag
Flag.prototype.idleCreepExcludeEnergyFull = function(value) {
    if(this.memory.role !== 'idle'){
        return false;
    }
    if (value !== undefined) {
        this.memory.idle_creep_exclude_energy_full = value;
    }
    return this.memory.idle_creep_exclude_energy_full;
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
Flag.prototype.idleCreepSlots = function() {
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

// checks if creep can idle at this flag
Flag.prototype.idleCreepValid = function(creep){

    var idleRole = this.idleCreepRole();
    if(
        idleRole &&
        idleRole !== creep.role()
    ){
        return false;
    }

    var idleSlots = this.idleCreepSlots();
    if(
        idleSlots !== true &&
        (
            idleSlots === false ||
            idleSlots < 1
        )
    ){
        return false;
    }

    var idleCreepExcludeEnergyFull = this.idleCreepExcludeEnergyFull();

    if(
        idleCreepExcludeEnergyFull &&
        creep.energy === creep.energyCapacity
    ){
        return false;
    }

    return true;
};

// healer flag

Flag.prototype.healerMax = function(value) {
    if(this.memory.role !== 'healer'){
        return false;
    }
    if (value !== undefined) {
        this.memory.healer_max = value;
    } else if(this.memory.healer_max === undefined){
        this.memory.healer_max = 3;
    }
    return this.memory.healer_max;
};

// current number of healers at this flag
Flag.prototype.healerCount = function() {
    if(this.memory.role !== 'healer'){
        return false;
    }
    var jobs = this.targetOfJobs(function(job){
        if(job){
            return job.type() === 'healer';
        }
        return false;
    });
    return jobs.length;
};

// heal targets within radius
Flag.prototype.healerRadius = function(value) {
    if(this.memory.role !== 'healer'){
        return false;
    }
    if (value !== undefined) {
        this.memory.healer_radius = value;
    } else if(this.memory.healer_radius === undefined){
        this.memory.healer_radius = 10;
    }
    return this.memory.healer_max;
};

// generic replacement ???
// Flag.prototype.creepRole = function(role){};
// Flag.prototype.creeps = function(filter){};
// Flag.prototype.creepCount = function(){};
// Flag.prototype.creepMax = function(value){};
//
// Flag.prototype.priority = function(value){};

// // heal / attack range
// Flag.prototype.activeRadius = function(role){};


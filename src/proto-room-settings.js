'use strict';

var defaults = {};

defaults[STRUCTURE_EXTENSION] = {
    build_priority: 0.95,
    repair_priority: 0.8,
    repair_start: 0.8,
    repair_end: 1,
};

defaults[STRUCTURE_ROAD] = {
    build_priority: 0.9,
    repair_priority: 0.5,
    repair_start: 0.5,
    repair_end: 1,
};

defaults[STRUCTURE_LINK] = {
    build_priority: 0.8,
    repair_priority: 0.7,
    repair_start: 0.95,
    repair_end: 1,
};

defaults[STRUCTURE_RAMPART] = {
    build_priority: 0.8,
    repair_priority: 0.9,
    repair_start: 0.9,
    repair_end: 1,
};

defaults[STRUCTURE_WALL] = {
    build_priority: 0.8,
    repair_priority: 0.6,
    repair_start: 0.1,
    repair_end: 0.1,
};

defaults[STRUCTURE_SPAWN] = {
    build_priority: 0.5,
    repair_priority: 0.9,
    repair_start: 0.95,
    repair_end: 1,
};

defaults[STRUCTURE_STORAGE] = {
    build_priority: 0.5,
    repair_priority: 0.6,
    repair_start: 0.95,
    repair_end: 1,
};

Room.prototype.structureSettings = function(structure){
    if (this.memory.structure_settings === undefined) {
        this.memory.structure_settings = defaults;
    }
    // if new structure type added
    else if(this.memory.structure_settings[structure] === undefined){
        this.memory.structure_settings[structure] = defaults[structure];
    }

    if(structure !== undefined){
        return this.memory.structure_settings[structure];
    }
    return this.memory.structure_settings;
};

// priority of repairing structures (0-1)
Room.prototype.repairPriority = function(structure, value) {
    var settings = this.structureSettings(structure);
    if (value !== undefined) {
        settings.repair_priority = value;
    }
    return settings.repair_priority;
};

// the percent hp a structure must have less than to begin repairs (0-1)
Room.prototype.repairStartThreshold = function(structure, value) {
    var settings = this.structureSettings(structure);
    if (value !== undefined) {
        settings.repair_start = value;
    }
    return settings.repair_start;
};


// the percent hp a structure must have greater than to end repairs (0-1)
Room.prototype.repairEndThreshold = function(structure, value) {
    var settings = this.structureSettings(structure);
    if (value !== undefined) {
        settings.repair_end = value;
    }
    return settings.repair_end;
};

// build priority (0-1)
Room.prototype.buildPriority = function(structure, value) {

    var settings = this.structureSettings(structure);
    if (value !== undefined) {
        settings.build_priority = value;
    }
    return settings.build_priority;
};

// if creep.ticksToLive <= threshold it will be replaced (if eligible)
Room.prototype.creepReplaceThreshold = function(value) {
    if (value !== void 0) {
        this.memory.creep_replace_threshold = value;
    } else if (!this.memory.creep_replace_threshold) {
        this.memory.creep_replace_threshold = 100;
    }
    return this.memory.creep_replace_threshold;
};

// min energy a pile must have to be considered for collection
Room.prototype.energyPileThresholdMin = function(value) {
    if (value !== void 0) {
        this.memory.energy_pile_threshold_min = value;
    }
    return this.memory.energy_pile_threshold_min || 50;
};

// the hard max number of creeps with given role allowed in this room
Room.prototype.roleCountMax = function(role, max) {
    if (this.memory.role_count_max === undefined) {
        this.memory.role_count_max = {};
    }
    var roleCountMax = this.memory.role_count_max;
    if (max !== undefined) {
        roleCountMax[role] = max;
    }
    return roleCountMax[role];
};

// the hard max number of jobs of a given type
// allowed to be allocated at one time in this room
Room.prototype.jobCountMax = function(type, max) {
    if (this.memory.job_count_max === undefined) {
        this.memory.job_count_max = {};
    }
    var jobCountMax = this.memory.job_count_max;
    if (max !== undefined) {
        jobCountMax[type] = max;
    }
    return jobCountMax[type];
};




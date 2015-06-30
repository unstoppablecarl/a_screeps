'use strict';

var defaultRepairPriority = {};
defaultRepairPriority[STRUCTURE_EXTENSION] = 0.95;
defaultRepairPriority[STRUCTURE_ROAD] = 0.9;
defaultRepairPriority[STRUCTURE_LINK] = 0.8;
defaultRepairPriority[STRUCTURE_RAMPART] = 0.6;
defaultRepairPriority[STRUCTURE_WALL] = 0.5;

Room.prototype.repairPriority = function(structure, priority) {
    if (!this.memory.repair_priority) {
        this.memory.repair_priority = defaultRepairPriority;
    }

    var repairPriority = this.memory.repair_priority;
    if (priority !== void 0) {
        repairPriority[structure] = priority;
    }
    return repairPriority[structure] || 0;
};

var defaultBuildPriority = {};
defaultBuildPriority[STRUCTURE_EXTENSION] = 0.95;
defaultBuildPriority[STRUCTURE_ROAD] = 0.9;
defaultBuildPriority[STRUCTURE_LINK] = 0.8;
defaultBuildPriority[STRUCTURE_RAMPART] = 0.6;
defaultBuildPriority[STRUCTURE_WALL] = 0.5;

Room.prototype.buildPriority = function(structure, priority) {
    if (!this.memory.repair_priority) {
        this.memory.repair_priority = defaultBuildPriority;
    }

    var buildPriority = this.memory.repair_priority;
    if (priority !== void 0) {
        buildPriority[structure] = priority;
    }
    return buildPriority[structure] || 0;
};


// the minimum percentage of room energy there must be to get energy for a job
Room.prototype.minJobEnergyRatio = function(ratio) {
    if (ratio !== void 0) {
        this.memory.job_min_energy_ratio = ratio;
    }
    var r = this.memory.job_min_energy_ratio;
    if (!r) {
        this.memory.job_min_energy_ratio = 0.5;
    }
    return this.memory.job_min_energy_ratio;
};

// the maximum percentage of room energy that can be used to spawn a creep
Room.prototype.maxCreepSpawnEnergyRatio = function(max) {
    if (max !== void 0) {
        this.memory.max_creep_spawn_energy_ratio = max;
    }
    var r = this.memory.max_creep_spawn_energy_ratio;
    if (!r) {
        this.memory.max_creep_spawn_energy_ratio = 0.5;
    }
    return this.memory.max_creep_spawn_energy_ratio;
};


// if creep.ticksToLive <= threshold it will be replaced
Room.prototype.creepReplaceThreshold = function(value) {
    if (value !== void 0) {
        this.memory.creep_replace_threshold = value;
    } else if (!this.memory.creep_replace_threshold) {
        this.memory.creep_replace_threshold = 100;
    }
    return this.memory.creep_replace_threshold;
};


// min energy a pile must have to be considered
Room.prototype.energyPileThresholdMin = function(value) {
    if (value !== void 0) {
        this.memory.energy_pile_threshold_min = value;
    }
    return this.memory.energy_pile_threshold_min || 150;
};

// the size of an energy pile required to prompt spawning another collector
Room.prototype.energyPileThresholdSpawn = function(value) {
    if (value !== void 0) {
        this.memory.energy_pile_threshold_spawn = value;
    }
    return this.memory.energy_pile_threshold_spawn || 1500;
};

// the max number of creeps with given role in this room
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

// the size of an energy pile required to prompt spawning another collector
Room.prototype.roleCountMax = function(value) {
    if (value !== void 0) {
        this.memory.energy_pile_threshold_spawn = value;
    }
    return this.memory.energy_pile_threshold_spawn || 1500;
};
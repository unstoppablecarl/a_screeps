'use strict';

require('mixin-job-target')(Flag.prototype);
Flag.prototype.isFlag = true;

/**
 * flag roles
 * idle
 * medical
 * guard
 * rampart
 * harvest
 *
 */

// the role of the flag, determines behavior of assigned creeps
Flag.prototype.role = function(value) {
    if (value !== undefined) {
        this.memory.role = value;
    }
    return this.memory.role;
};

// creep roles that can be assigned to this flag
Flag.prototype.creepRoles = function(arr) {
    if (arr !== undefined) {
        this.memory.creep_roles = arr;
    }

    return this.memory.creep_roles;
};

// array of creep roles that cannot be assigned to this flag
Flag.prototype.creepRolesExcluded = function(arr) {
    if (arr !== undefined) {
        this.memory.creep_roles_excluded = arr;
    }

    return this.memory.creep_roles_excluded;
};

// if true exclude creeps with full energy from being assigned to this flag
Flag.prototype.excludeCreepEnergyFull = function(value) {
    if (value !== undefined) {
        this.memory.exclude_creep_energy_full = value;
    }
    return this.memory.exclude_creep_energy_full;
};

// if true exclude creeps with no energy from being assigned to this flag
Flag.prototype.excludeCreepEnergyEmpty = function(value) {
    if (value !== undefined) {
        this.memory.exclude_creep_energy_empty = value;
    }
    return this.memory.exclude_creep_energy_empty;
};

// check if the creep role can be assigned to this flag
Flag.prototype.creepRoleValid = function(role) {
    var excludedRoles = this.creepRolesExcluded();

    if(
        excludedRoles &&
        excludedRoles.length &&
        excludedRoles.indexOf(role) !== -1
    ){
        return false;
    }

    var creepRoles = this.creepRoles();

    if(
        creepRoles &&
        creepRoles.length &&
        excludedRoles.indexOf(role) === -1
    ){
        return false;
    }

    return true;
};

// check if creep can be assigned to this flag
Flag.prototype.creepValid = function(creep) {
    var role = creep.role();
    if(!this.creepRoleValid(role)){
        return false;
    }

    if(
        this.excludeCreepEnergyFull() &&
        !creep.energyCanCarryMore()
    ){
        return false;
    }

    if(
        this.excludeCreepEnergyEmpty() &&
        creep.carry.energy === 0
    ){
        return false;
    }

    return true;
};

// get array of creeps assigned to this flag
Flag.prototype.creeps = function(type){
    return this.targetOfJobs(function(job){
        return (
            job &&
            job.source()
        );
    }).map(function(job){
        return job.source();
    });
};

// get array of creeps by job type
Flag.prototype.creepsByJobType = function(type){
    return this.targetOfJobs(function(job){
        return (
            job &&
            type === job.type() &&
            job.source()
        );
    }).map(function(job){
        return job.source();
    });
};

// total creeps assigned to flag
Flag.prototype.creepsCount = function(){
    return this.targetOfJobs(function(job){
        return (
            job &&
            job.source()
        );
    }).length;
};

// max creeps that can be assigned to flag
// if not set returns sum of creepRoleMax roles
Flag.prototype.creepMax = function(value){
    if (value !== undefined) {
        this.memory.creep_max = value;
    }

    var result = this.memory.creep_max;

    if(!_.isNumber(result)){
       return false;
    }
    return result;
};

// max creeps of given role assigned to flag
// falsy values ignored and considered unlimited
Flag.prototype.creepRoleMax = function(role, value){
    if (this.memory.role_count_max === undefined) {
        this.memory.role_count_max = {};
    }
    var roleCountMax = this.memory.role_count_max;
    if (value !== undefined) {
        // remove value from memory
        if(!value){
            value = undefined;
        }
        roleCountMax[role] = value;
    }
    return roleCountMax[role];
};

// priority of the flag when deciding what flag to assign a creep to
// not related to job priority
// simply defines importance of flag among other flags with same role
Flag.prototype.allocatePriority = function(value){
    if (value !== undefined) {
        this.memory.allocate_priority = value;
    }
    return this.memory.allocate_priority;
};

// overrides the priority of jobs related to this flag
Flag.prototype.jobPriorityOverride = function(value){
    if (value !== undefined) {
        this.memory.job_priority_override = value;
    }
    return this.memory.job_priority_override;
};

// the affected radius of the flag (heal, attack, etc)
Flag.prototype.activeRadius = function(value){
    if (value !== undefined) {
        this.memory.active_radius = value;
    }
    return this.memory.active_radius;
};

// if true creeps should never be spawned for
// the purpose of being assigned to this flag
Flag.prototype.allocateExistingOnly = function(value){
    if(this.role() === 'idle'){
        return true;
    }
    if (value !== undefined) {
        this.memory.allocate_existing_only = value;
    }
    return this.memory.allocate_existing_only;
};

// settings specific to the flag's role
Flag.prototype.settings = function(settings){
    if (settings !== undefined) {
        this.memory.settings = settings;
    }
    return this.memory.settings;
};


// role specific

// id of harvest source
Flag.prototype.harvestSourceId = function(id) {
    if(this.memory.role !== 'harvest'){
        return false;
    }

    var settings = this.settings() || {};
    if (id !== undefined) {
        settings.source_id = id;
        this.settings(settings);
    }
    else if(settings.source_id === undefined){
        var sources = this.pos.findInRange(FIND_SOURCES, 2);
        if(sources.length){
            settings.source_id = sources[0].id;
        }
        this.settings(settings);
    }
    return settings.source_id;
};

// harvest source object
Flag.prototype.harvestSource = function(source) {
    if(this.memory.role !== 'harvest'){
        return false;
    }
    if (source !== undefined) {
        this.harvestSourceId(source.id);
    }
    return Game.getObjectById(this.harvestSourceId());
};

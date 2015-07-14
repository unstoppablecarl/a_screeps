'use strict';

require('mixin-job-target')(Flag.prototype);

/**
 * flag roles
 * med
 * guard
 * rampart
 * source
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
        creep.energy === creep.energyCapacity
    ){
        return false;
    }

    if(
        this.excludeCreepEnergyEmpty() &&
        creep.energy === 0
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
Flag.prototype.creepsCount = function(type){
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
        result = 0;
        if(this.memory.role_count_max){
            for(var key in this.memory.role_count_max){
                result += this.memory.role_count_max[key];
            }
        }
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
        roleCountMax[role] = value;
    }
    return roleCountMax[role];
};

// priority of the flag when deciding what flag to assign a creep to
Flag.prototype.priority = function(value){
    if (value !== undefined) {
        this.memory.priority = value;
    }
    return this.memory.priority;
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

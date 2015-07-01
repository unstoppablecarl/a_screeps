'use strict';

var roles = {
    carrier: require('role-carrier'),
    guard: require('role-guard'),
    harvester: require('role-harvester'),
    tech: require('role-tech'),
    upgrader: require('role-upgrader'),
};

require('mixin-job-target')(Creep.prototype);

Creep.prototype.act = function() {
    var role = this.role();
    var roleHandler = roles[role];
    if(!roleHandler){
        console.log("ERRROR role handler not found");
    }
    if (this.memory.pending_creation){
        if(roleHandler.init) {
            roleHandler.init(this);
        }
        this.memory.pending_creation = undefined;
    }
    if (roleHandler.act) {
        roleHandler.act(this);
    }

    var job = this.job();
    if (job) {
        var jobHandler = job.handler();
        if(jobHandler.act){
            jobHandler.act(this);
        }
    }
};

Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Creep.prototype.idle = function(value) {
    return !this.job();
};

Creep.prototype.jobId = function(id) {
    if(id !== void 0){
        this.memory.source_of_job_id = id;
    }
    return this.memory.source_of_job_id;
};

Creep.prototype.job = function(job) {
    if (job !== void 0) {
        this.jobId(job.id);
    }
    return this.room.jobList.get(this.jobId());
};

Creep.prototype.clearJob = function() {
    this.memory.source_of_job_id = undefined;
};




// harvesters
Creep.prototype.energySourceId = function(id) {
    if (id !== void 0) {
        this.memory.energy_sorce_id = id;
    }
    return this.memory.energy_sorce_id;
};

Creep.prototype.energySource = function(obj) {
    if (obj !== void 0) {
        this.energySourceId(obj.id);
    }
    return Game.getObjectById(this.energySourceId());
};

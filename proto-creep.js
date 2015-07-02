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
        console.log("ERRROR role handler not found for role: " + role);
        return;
    }
    var job = this.job();
    if (this.memory.pending_creation){
        if(roleHandler.init) {
            roleHandler.init(this);
        }

        if(job && job.sourcePendingCreation()){
            job.source(this);
            job.sourcePendingCreation(false);
            job.start();
        }
        this.memory.pending_creation = undefined;
    }
    if (roleHandler.act) {
        roleHandler.act(this);
    }

    if (job) {
        var jobHandler = job.handler();
        if(jobHandler.act){
            jobHandler.act(this, job);
        }
        this.say(job.type());
    } else {

    }

};

Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Creep.prototype.idle = function() {
    var job = this.job();
    var type;
    if(job){
        type = job.type();
    }
    // if(value !== undefined && type !== 'idle'){
    //     if(job){
    //         job.end();
    //     }
    //     console.log('add idle');
    //     var role = this.role();
    //     var target = this.pos.findClosestIdleFlag(this, role);
    //     if(target){
    //         var newJob = this.room.jobList().add({
    //             type: 'idle',
    //             role: role,
    //             source: this,
    //             target: target
    //         });
    //     }
    //     if(job){
    //         job.cancel();
    //     }
    //     newJob.start();
    // }

    return !job || type === 'idle';
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
    return this.room.jobList().get(this.jobId());
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

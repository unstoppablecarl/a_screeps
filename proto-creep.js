'use strict';

var roles = require('roles');

require('mixin-job-target')(Creep.prototype);

Creep.prototype.act = function() {
    var mem = this.memory;
    var role = this.role();
    var job = this.job();
    if (mem.pending_creation) {
        if (job && job.sourcePendingCreation()){
            job.source(this);
            job.sourcePendingCreation(false);
            job.sourcePendingCreationBody(false);
            job.start();
        }
        mem.pending_creation = undefined;
        mem.pending_creation_body = undefined;
    }

    if (job) {
        this.memory.tics_without_job = 0;
        var jobHandler = job.handler();
        if(jobHandler.act){
            jobHandler.act(this, job);
        }
    }

    else {

        if(mem.tics_without_job === undefined){
            mem.tics_without_job = 0;
        }
        mem.tics_without_job++;

        if(mem.tics_without_job > 5){
            var idleFlag = this.pos.findClosestIdleFlag(role);
            if(idleFlag){
                this.room.jobList().add({
                    type: 'idle',
                    role: role,
                    source: this,
                    target: idleFlag
                })
                .start();
            }
        }
    }

    // if(mem.tics_without_energy === undefined){
    //     mem.tics_without_energy = 0;
    // }

    // if(this.energy === 0){
    //     mem.tics_without_energy++;
    // } else {
    //     mem.tics_without_energy = 0;
    // }

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
    var jobId = this.jobId();
    if(!jobId){
        return false;
    }
    return this.room.jobList().get(jobId);
};

Creep.prototype.clearJob = function() {
    this.memory.source_of_job_id = undefined;
};

// if this creep has been replaced because it is about to die
Creep.prototype.replaced = function(replaced) {
    if (replaced !== void 0) {
        this.memory.replaced = replaced;
    }
    return this.memory.replaced;
};

// if this creep is at or close enough to its assigned flag
Creep.prototype.atFlag = function(value) {
    if (value !== void 0) {
        this.memory.at_flag = value;
    }
    return this.memory.at_flag;
};


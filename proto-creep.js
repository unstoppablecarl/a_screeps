'use strict';

var rolesMeta = require('roles-meta');

require('mixin-job-target')(Creep.prototype);

Creep.prototype.act = function() {
    var mem = this.memory;
    var role = this.role();
    var job = this.job();

    if(this.hurtLastTick()){
        this.say('owch');
    }

    if (mem.pending_creation) {
        if (job && job.sourcePendingCreation()){
            job.source(this);
            job.sourcePendingCreation(false);
            job.sourcePendingCreationBody(false);
            job.start();
        }
        mem.pending_creation = undefined;
    }

    if (job) {
        mem.ticks_without_job = 0;
        var jobHandler = job.handler();
        if(jobHandler.act){
            jobHandler.act(this, job);
        }
    }
    else {
        if(mem.ticks_without_job === undefined){
            mem.ticks_without_job = 0;
        }
        mem.ticks_without_job++;
    }

    if(mem.ticks_without_job > 2){
        var idleFlag = this.pos.findClosestIdleFlag(this);
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

    mem.prev_hits = this.hits;

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

// if this creep's role needs energy delivered
Creep.prototype.roleNeedsEnergy = function(){
    var role = this.role();
    if(rolesMeta.roles[role] !== undefined){
        return rolesMeta.roles[role].needs_energy_delivered;
    }
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
    if (replaced !== undefined) {
        // remove to save memory
        if(!replaced){
            replaced = undefined;
        }
        this.memory.replaced = replaced;
    }
    return this.memory.replaced;
};

Creep.prototype.adjacentHostiles = function(filter) {
    var pos = this.pos;
    var top = pos.y - 1;
    var bottom = pos.y + 1;
    var left = pos.x - 1;
    var right = pos.y + 1;

    var result = this.room.lookForAtArea('creep', top, left, bottom, right);

    var targets = [];

    for(var x in result){
        var row = result[x];
        for(var y in row){
            var target = row[y];
            if(
                target &&
                !target.my
            ){

                targets.push(target);
            }
        }
    }

    if(filter){
        targets = targets.filter(filter);
    }
    return targets;
};

Creep.prototype.hurtLastTick = function(){
    return this.hits < this.memory.prev_hits;
};

Creep.prototype.attackDamage = function(){
    var parts = this.getActiveBodyparts(ATTACK);
    // ATTACK_POWER is undocumented
    return parts * (ATTACK_POWER || 30);
};

Creep.prototype.rangedAttackDamage = function(){
    var parts = this.getActiveBodyparts(RANGED_ATTACK);
    // RANGED_ATTACK_POWER is undocumented

    return parts * (RANGED_ATTACK_POWER || 10);
};


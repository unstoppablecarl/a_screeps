'use strict';

var roles = {
    builder: require('act-builder'),
    guard: require('act-guard'),
    harvester: require('act-harvester'),
};

Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Creep.prototype.spawnId = function(id) {
    if (id !== void 0) {
        this.memory.spawn_id = id;
    }
    return this.memory.spawn_id;
};

Creep.prototype.spawn = function(spawn) {
    if (spawn !== void 0) {
        this.memory.spawn_id = spawn.id;
    }
    return Game.getObjectById(this.spawnId());
};

Creep.prototype.assignedFlagId = function(id) {
    if (id !== void 0) {
        this.memory.assigned_flag_id = id;
    }
    return this.memory.assigned_flag_id;
};

Creep.prototype.assignedFlag = function(flag) {
    if (flag !== void 0) {
        this.assignedFlagId(flag.id);
    }
    return Game.getObjectById(this.assignedFlagId());
};

Creep.prototype.sourceId = function(id) {
    if (id !== void 0) {
        this.memory.source_id = id;
    }
    return this.memory.source_id;
};

Creep.prototype.source = function(source) {
    if (source !== void 0) {
        this.sourceId(source.id);
    }
    return Game.getObjectById(this.sourceId());
};

Creep.prototype.assignToFlag = function(flag){
    var role = this.role();
    if(flag.role() !== role){
        console.log('FLAG ASSIGN ERROR');
        return;
    }
    var roleHandler = roles[role];
    if(roleHandler && roleHandler.onAssignToFlag){
        roleHandler.onAssignToFlag(this, flag);
    }
};

Creep.prototype.act = function() {
    var role = this.role();
    var roleHandler = roles[role];
    if(roleHandler && roleHandler.act){
        roleHandler.act(this);
    }

};
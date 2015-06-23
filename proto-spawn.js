'use strict';
    var creepTypes = require('creep-types');

Spawn.prototype.spawnCreep = function(type, role, flag) {
    var creepType = creepTypes[type];
    console.log('creepType', type);
    var body = creepType.parts;
    role = role || creepType.defaultRole;
    memory = memory || {};

    var canCreate = this.canCreateCreep(body);
    if (canCreate !== OK) {
        console.log(this.name, 'cannot create', type, canCreate);
        return;
    }
    var flagId;
    if(flag){
        flagId = flag.id;
    }
    var memory = {
        spawn_id: this.id,
        role: role,
        pending_creation: true,
        assigned_flag_id: flagId
    };

    var creepName = this.createCreep(body, null, memory);
    console.log(this.name, 'spawning', creepName, body, role);
    return creepName;
};

var bodyPartCost = {
    MOVE: 50,
    WORK: 100,
    CARRY: 50,
    ATTACK: 80,
    RANGED_ATTACK: 150,
    HEAL: 200,
    TOUGH: 10,
};

Spawn.prototype.getCreepCost = function(body){
    var total = 0;
    for (var i = 0; i < body.length; i++) {
        var part = body[i];
        total += bodyPartCost[part];
    }
    return total;
};
'use strict';
    var creepTypes = require('creep-types');

Spawn.prototype.spawnCreep = function(type, role) {
    var creepType = creepTypes[type];
    var body = creepType.parts;
    role = role || creepType.defaultRole;

    var canCreate = this.canCreateCreep(body);
    if (canCreate !== OK) {
        console.log(this.name, 'cannot create', type, canCreate);
        return;
    }
    var memory = {
        spawn_id: this.id,
        role: role,
        pending_creation: true,
    };

    var creepName = this.createCreep(body, null, memory);
    console.log(this.name, 'spawning', creepName, body, role);
};

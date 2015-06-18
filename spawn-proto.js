'use strict';

var creepTypes = require('creep-types');

Spawn.prototype.spawnCreep = function(type, role) {
    role = role || type;

    var body = creepTypes[type];
    var memory = {role: role};
    var creepName = this.createCreep(body, null);
};

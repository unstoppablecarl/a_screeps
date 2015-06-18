'use strict';

var data = {
    harvester: {
        role: 'harvester',
        parts: [WORK, CARRY, MOVE],
    },
    builder: {
        role: 'builder',
        parts: [WORK, WORK, WORK, CARRY, MOVE],
    },
    guard: {
        role: 'guard',
        parts: [TOUGH, ATTACK, MOVE, MOVE],
    }
};

module.exports = data;
'use strict';

var data = {
    harvester: {
        defaultRole: 'harvester',
        parts: [WORK, CARRY, MOVE],
    },
    builder: {
        defaultRole: 'builder',
        parts: [WORK, WORK, WORK, CARRY, MOVE],
    },
    guard: {
        defaultRole: 'guard',
        parts: [TOUGH, ATTACK, MOVE, MOVE],
    },
    repair: {
        defaultRole: 'guard',
        parts: [MOVE, WORK, CARRY],

    }
};

module.exports = data;
'use strict';

var role = {
    init: false,

    act: function(creep) {

        var range = creep.memory.hostile_range || 10;
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);

        if (targets.length) {
            var target = creep.pos.findClosest(targets);
            creep.moveTo(target);
            creep.attack(target);

        } else {
            creep.moveTo(creep.assignedFlag());
        }
    },

    onAssignToFlag: false,
};

module.exports = role;
'use strict';

// carries energy
var role = {
    init: false,
    act: function(creep) {
        if (creep.idle() && creep.energy === creep.energyCapacity) {
            creep.startTask('energy_store');
        }
    },
};

module.exports = role;

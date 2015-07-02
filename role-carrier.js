'use strict';

// carries energy
var role_carrier = {
    init: false,
    act: function(creep) {
        if (creep.idle() && creep.energy > 0) {
            var target = creep.pos.findClosestEnergyStore();
            if(target){
                var newJob = creep.room.jobList().add({
                    role: 'harvester',
                    type: 'energy_store',
                    source: creep,
                    target: target
                });
                newJob.start();
            }
        }
    },
};

module.exports = role_carrier;

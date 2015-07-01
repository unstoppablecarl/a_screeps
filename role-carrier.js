'use strict';

// carries energy
var role_carrier = {
    init: false,
    act: function(creep) {
        if (!creep.job() && creep.energy > 0) {
            var target = creep.closestEnergyStore();
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

'use strict';

// bring energy to creep
var job_energy_deliver = {
    name: 'energy_deliver',
    start: false,
    act: function(creep, job) {
        var target = creep.taskTarget();
        if(!target){
            creep.cancelTask();
            return;
        }

        if (target) {
            if (target.energy === target.energyCapacity) {
                creep.endTask();
                return;
            }
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if (result === OK) {
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_energy_deliver;

'use strict';

// bring energy to creep
var job_energy_deliver = {
    name: 'energy_deliver',
    start: false,
    act: function(creep, job) {
        var target = job.target();
        if(!target){
            job.end();
            return;
        }

        if (target) {
            if (target.energy === target.energyCapacity) {
                job.end();
                return;
            }
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if (result === OK) {
                job.end();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_energy_deliver;

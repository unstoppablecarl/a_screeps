'use strict';

// bring energy to creep
var job_energy_deliver = {
    name: 'energy_deliver',
    act: function(creep, job) {

        if(creep.energy === 0){
            job.end();
            return;
        }

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
            var result = creep.transferEnergy(target);
            if(result !== OK){
                if(ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                } else {
                    job.end();
                }
            }
        }
    },
};

module.exports = job_energy_deliver;

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
                if(result === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                } else {
                    job.end();
                }
            }
        }
    },

    getJobs: function(room) {

        return room.creeps(function(creep){
            var role = creep.role();
            return (
                creep.roleNeedsEnergy() &&
                creep.energy < creep.energyCapacity &&
                // @TODO allocate multiple to same destination based on energy capacity vs assigned to be delivered
                !creep.isTargetOfJobType('energy_deliver')
            );
        }).map(function(creep){

            var priority = 0.6;
            priority += (1 - (creep.energy / creep.energyCapacity)) * 0.1;

            return {
                role: 'carrier',
                type: 'energy_deliver',
                target: creep,
                priority: priority,
            };
        });
    },
};

module.exports = job_energy_deliver;

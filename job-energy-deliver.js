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

    // return only 1 job per creep to deliver to,
    // to be broken into smaller jobs later
    getJobs: function(room) {

        var jobs = [];

        room.creeps().forEach(function(creep){
            var role = creep.role();

            if(
                creep.idle() ||
                !creep.roleNeedsEnergy() ||
                creep.energy === creep.energyCapacity ||
                creep.isTargetOfJobType('energy_deliver')
            ){
                return;
            }

            var energyNeeded = creep.energyCapacity - creep.energy;
            var energyToBeDelivered = creep.targetOfJobs(function(job){
                return (
                    job.type() === 'energy_deliver' &&
                    job.source()
                );
            }).reduce(function(total, job){

                return total + job.source().energy;
            }, 0);

            var energyDeliveryNeeded = energyNeeded - energyToBeDelivered;

            var priority = 0.6;
            var energyPriority = (1 - (creep.energy / creep.energyCapacity));
            var jobPriority = creep.job().priority();
            // average
            // move one decimal place
            priority += ((energyPriority + jobPriority) / 2) * 0.1;

            jobs.push({
                role: 'carrier',
                type: 'energy_deliver',
                target: creep,
                priority: priority,
                allocation_settings: {
                    energy_delivery_needed: energyDeliveryNeeded
                }
            });
        });

        return jobs;
    },
};

module.exports = job_energy_deliver;

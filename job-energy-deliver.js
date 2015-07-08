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

        var jobs = [];

        room.creeps().forEach(function(creep){
            var role = creep.role();

            if(
                !creep.roleNeedsEnergy() ||
                creep.energy === creep.energyCapacity
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

            energyNeeded -= energyToBeDelivered;

            var priority = 0.6;
            priority += (1 - (creep.energy / creep.energyCapacity)) * 0.1;

            jobs.push({
                role: 'carrier',
                type: 'energy_deliver',
                target: creep,
                priority: priority,
                allocation_settings: {
                    energy_needed: energyNeeded
                }
            });
        });

        return jobs;
    },
};

module.exports = job_energy_deliver;

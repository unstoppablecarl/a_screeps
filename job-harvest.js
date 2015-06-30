'use strict';

var job_harvest = {
    name: 'harvest',
    start: false,
    act: function(creep){
        var job = creep.job();
        var target;

        if(job){
            target = job.target();
        }

        if(target){
            var result = creep.harvest(target);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            if(creep.energy === creep.energyCapacity){
                creep.dropEnergy();
            }
        } else {
            creep.cancelTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_harvest;

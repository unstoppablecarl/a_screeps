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

            var flag = job.target();
            // console.log('flag', JSON.stringify(flag));
                        // console.log(flag.constructor);
                        // console.log(Flag.prototype.source);

            var source = flag.source();

            var result = creep.harvest(source);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            if(creep.energy === creep.energyCapacity){
                job.end();
            }
        } else {
            job.end();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_harvest;

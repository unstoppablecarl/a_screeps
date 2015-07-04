'use strict';

var job_repair = {
    name: 'repair',
    start: false,
    act: function(creep, job){
        var target = job.target();
        if(target){
            creep.moveTo(target);

            var result = creep.repair(target);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }

            if(target.hits === target.hitsMax){
                job.end();
            }
        } else {
            job.end();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_repair;

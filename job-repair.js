'use strict';

var job_repair = {
    name: 'repair',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var result = creep.repair(target);
        if(result !== OK){
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
                return;
            }
        }

        if(target.hits === target.hitsMax){
            job.end();
        }

    },
};

module.exports = job_repair;

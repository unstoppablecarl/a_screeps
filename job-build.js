'use strict';

var job_build = {
    name: 'build',
    start: false,
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
        }

        if(target){
            var result = creep.build(target);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
    },
    cancel: false,
};

module.exports = job_build;

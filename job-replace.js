'use strict';

var job_replace = {
    name: 'replace',
    start: function(creep){

        var target = creep.job().target();
        var targetJob = target.job();

        if(targetJob){
            var jobsActive = creep.room.jobsActive();
            var job = jobsActive.add(targetJob.data);
        }


        creep.room.jobManager().assignJob()
    },
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            creep.repair(target);
            if(target.hits === target.hitsMax){
                creep.endTask();
            }
        } else {
            creep.cancelTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_replace;

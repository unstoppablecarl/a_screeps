'use strict';

var job_replace = {
    name: 'replace',
    start: function(creep){

        var target = creep.job().target();
        var targetJob = target.job();

        if(targetJob){


            var newJob = creep.room.jobList().add({
                source: creep,
                target: targetJob.target(),
                type: targetJob.type(),
                role: targetJob.role(),
                settings: targetJob.settings(),
            });
            newJob.start();
        }
    },
    act: false,
    cancel: false,
    end: false,
};

module.exports = job_replace;

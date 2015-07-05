'use strict';

var job_replace = {
    name: 'replace',
    // use act so that code executes when creep is first created
    act: function(creep, job){
        job.end();
        return;
        // var target = job.target();
        // if(!target){
        //     job.end();
        //     return;
        // }

        // target.replaced(true);

        // var targetJob = target.job();
        // if(!targetJob){
        //     job.end();
        //     return;
        // }

        // if(targetJob){

        //     job.end();
        //     var newJob = creep.room.jobList().add({
        //         source: creep,
        //         target: targetJob.target(),
        //         type: targetJob.type(),
        //         role: targetJob.role(),
        //         settings: targetJob.settings(),
        //     });
        //     newJob.start();
        // }
    },
};

module.exports = job_replace;

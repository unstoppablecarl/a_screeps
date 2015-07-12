'use strict';

var job_replace = {
    name: 'replace',
    // use act so that code executes when creep is first created
    act: function(creep, job){

        var target = job.target();
        if(!target){
            job.end();
            return;
        }
        target.replaced(true);

        var targetJob = target.job();
        if(!targetJob){
            job.end();
            return;
        }

        if(targetJob){
            var newJobTarget = targetJob.target();
            if(newJobTarget){
                job.end();
                creep.room.jobList().add({
                    source: creep,
                    target: newJobTarget,
                    type: targetJob.type(),
                    role: targetJob.role(),
                    settings: targetJob.settings(),
                }).start();
            }

            return;
        }

        job.end();
    },

    getJobs: function(room){

        // @TODO base threshold on distance from spawn
        var threshold = room.creepReplaceThreshold();

        // @TODO exclude unused
        // something more advanced than just checking .idle() like idle for a while?
        var creeps = room.creeps(function(creep) {

            if(creep.idle()){
                return false;
            }

            return (
                creep.ticksToLive < threshold && // close enough to death to be replaced
                !creep.replaced() && // already been replaced
                !creep.isTargetOfJobType('replace') // already assigned a replace job
            );
        });

        return creeps.map(function(creep) {

            var job = creep.job();
            var priority = 0;
            if(job){
                priority = job.priority();
            }
            return {
                target: creep,
                type: 'replace',
                role: creep.role(),
                priority: priority
            };
        });
    },

};

module.exports = job_replace;

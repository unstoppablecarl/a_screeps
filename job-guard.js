'use strict';

// follow and protect a target
// not optimized for stationary targets see job-move-to-flag.js
var job_guard = {
    name: 'guard',
    act: function(creep, job){
        var defendTarget = job.target();
        if(!defendTarget){
            job.end();
            return;
        }

        var settings = job.settings();
        var followDistance = settings.target_follow_distance || 5;
        var hostileRange = settings.hostile_range || 10;

        if(creep.pos.inRangeTo(defendTarget, followDistance)){

            var targets = defendTarget.pos.findInRange(FIND_HOSTILE_CREEPS, hostileRange);

            if (targets.length) {
               var target = creep.pos.findClosest(targets);
                if(target){
                    creep.room.jobList().add({
                        type: 'attack',
                        role: 'guard',
                        source: creep,
                        target: target
                    }).start();
                }
            }

        } else {
            creep.moveTo(defendTarget);
        }
    }
};

module.exports = job_guard;

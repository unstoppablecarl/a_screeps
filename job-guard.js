'use strict';

var job_guard = {
    name: 'guard',
    act: function(creep, job){
        var target = job.target();
        if(target){
            creep.moveTo(target);
            var settings = job.settings();
            var distance = settings.target_precision || 2;
            // if(creep.pos.inRangeTo(target, distance)){
            //     this.watch(creep, job);
            // }
        } else {
            job.end();
        }
    },
    // watch: function(creep, job){
    //     var target;
    //     var range = creep.memory.hostile_range || 10;
    //     var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);

    //     if (targets.length) {
    //         target = creep.pos.findClosest(targets);
    //     }

    //     if(target){
    //         var newJob = creep.room.jobList().add({
    //             type: 'attack',
    //             role: 'guard',
    //             source: creep,
    //             target: target
    //         });

    //         newJob.start();
    //     }
    // },
};

module.exports = job_guard;

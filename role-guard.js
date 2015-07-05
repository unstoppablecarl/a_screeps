'use strict';

var role_guard = {
    act: function(creep, job) {
        // if(creep.idle()){
            // var target;
            // var range = creep.memory.hostile_range || 10;
            // var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);

            // if (targets.length) {
            //     target = creep.pos.findClosest(targets);
            // }

            // if(target){
            //     var newJob = creep.room.jobList().add({
            //         type: 'attack',
            //         role: 'guard',
            //         source: creep,
            //         target: target
            //     });

            //     newJob.start();
            // }
        // }
    },

    onAssignToFlag: false,
};

module.exports = role_guard;
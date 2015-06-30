'use strict';

var job_build = {
    name: 'build',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();

        if(!target){
            creep.endTask();
        }

        if(target){
            creep.moveTo(target);
            creep.build(target);
        }
    },
    cancel: false,
};

module.exports = job_build;

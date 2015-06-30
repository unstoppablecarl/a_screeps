'use strict';

var job_repair = {
    name: 'repair',
    start: false,
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

module.exports = job_repair;

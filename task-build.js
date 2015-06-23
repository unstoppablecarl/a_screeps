'use strict';

var task = {
    name: 'build',
    start: function(creep){
        var target = creep.taskTarget();
        if(!target){
            target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            if(target){
                creep.taskTarget(target);
            }
        }
    },
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            creep.build(target);
        }
    },
    cancel: false,
};

module.exports = task;

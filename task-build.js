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

        if(!target){
            creep.cancelTask();
        }
    },
    act: function(creep){
        if(creep.energy === 0){
            creep.cancelTask();
        }

        var target = creep.taskTarget();

        if(target){
            creep.moveTo(target);
            var result = creep.build(target);
        } else {
            this.start(creep);
        }


    },
    cancel: false,
};

module.exports = task;

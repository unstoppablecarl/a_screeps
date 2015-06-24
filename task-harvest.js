'use strict';

var task = {
    name: 'harvest',
    start: function(creep){

        var target = creep.taskTarget();

        if(!target){
            target = creep.source();
            if(!target){
                target = creep.pos.findClosest(FIND_SOURCES);
            }

            if(target){
                creep.taskTarget(target);
            }
        }
    },
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            var result = creep.harvest(target);
            if(creep.energy == creep.energyCapacity){
                creep.endTask();
            }
        } else {
            this.start(creep);
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;

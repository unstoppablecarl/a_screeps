'use strict';

var task = {
    name: 'harvest',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            var result = creep.harvest(target);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            if(creep.energy === creep.energyCapacity){
                creep.dropEnergy();
            }
        } else {
            creep.cancelTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;

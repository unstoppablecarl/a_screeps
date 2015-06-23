'use strict';

var task = {
    name: 'return_energy',
    start: function(creep){

        var target = creep.taskTarget();

        if(!target){
            target = creep.spawn();
            if(!target){
                target = creep.pos.findClosest(FIND_MY_SPAWNS);
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
            var result = creep.transferEnergy(target);
            if(result === OK){
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;

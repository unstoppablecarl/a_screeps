'use strict';

var task = {
    name: 'repair',
    start: function(creep){
        var target = creep.taskTarget();
        if(!target){

            target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                filter: function(s){
                    return s.hits < s.hitsMax;
                }
            });

            if(!target){
                target = creep.pos.findClosest(FIND_STRUCTURES, {
                    filter: function(s){
                        return !s.owner && s.hits < s.hitsMax;
                    }
                });
            }

            if(target){
                creep.taskTarget(target);
            }
        }
    },
    act: function(creep){

        if(creep.energy === 0){
            creep.cancelTask();
            return;
        }

        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            creep.repair(target);
            if(target.hits === target.hitsMax){
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;

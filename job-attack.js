'use strict';

var job_attack = {
    name: 'attack',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();

        if(!target){
            creep.endTask();
        }

        if(target){
            creep.moveTo(target);
            creep.attack(target);
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_attack;

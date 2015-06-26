'use strict';

var task = {
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

module.exports = task;

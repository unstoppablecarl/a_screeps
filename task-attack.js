'use strict';

var task = {
    name: 'harvest',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            creep.attack(target);
        } else {
            creep.endTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;

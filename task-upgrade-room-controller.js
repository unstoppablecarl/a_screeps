'use strict';

var task = {
    name: 'upgrade_room_controller',
    start: function(creep){
        var target = creep.taskTarget();
        if(!target){
            target = creep.room.controller;
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
            creep.upgradeController(target);
        } else {
            this.start(creep);
        }
    },
    cancel: false,
};

module.exports = task;

'use strict';

var task = {
    name: 'upgrade_room_controller',
    start: false,
    _findTarget: function(creep){
        var target = creep.taskTarget();
        if(!target){
            target = creep.room.controller;
            if(target){
                creep.taskTarget(target);
            }
        }

        return target;
    },
    act: function(creep){
        var target = this._findTarget(creep);
        if(!target){
            creep.cancelTask();
        }

        if(target){
            creep.moveTo(target);
            creep.upgradeController(target);
        }
    },
    cancel: false,
};

module.exports = task;

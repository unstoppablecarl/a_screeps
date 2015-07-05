'use strict';

var task = {
    name: 'upgrade_room_controller',
    _findTarget: function(creep, job){
        var target = job.target();
        if(!target){
            target = creep.room.controller;
            if(target){
                job.target(target);
            }
        }

        return target;
    },
    act: function(creep, job){
        var target = this._findTarget(creep, job);
        if(!target){
            creep.cancelTask();
        }

        if(target){
            creep.moveTo(target);
            creep.upgradeController(target);
        }
    },
};

module.exports = task;

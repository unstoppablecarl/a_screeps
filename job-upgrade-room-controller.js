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
            job.cancel();
        }

        var result = creep.repair(target);
        if(result === ERR_NOT_IN_RANGE){
            creep.moveTo(target);
        } else {
            job.end();
        }

    },
};

module.exports = task;

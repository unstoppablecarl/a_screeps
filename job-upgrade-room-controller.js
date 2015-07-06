'use strict';

var task = {
    name: 'upgrade_room_controller',
    act: function(creep, job){
        var target = job.target();
        if(!target){
            target = creep.room.controller;
            if(target){
                job.target(target);
            }
        }

        if(!target){
            job.end();
            return;
        }

        var result = creep.upgradeController(target);
        if(result !== OK){
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
                return;
            }
        }

    },
};

module.exports = task;

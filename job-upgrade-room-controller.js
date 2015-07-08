'use strict';

var job_upgrade_room_controller = {
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


    getJobs: function(room) {
        var controller = room.controller;
        if(!controller){
            return [];
        }

        var roleMax = room.roleCountMax('upgrader');

        if(!roleMax){
            var adjacentTiles = controller.pos.adjacentEmptyTileCount();
            roleMax = room.roleCountMax('upgrader', adjacentTiles);
        }

        if(controller.targetOfJobTypeCount('upgrade_room_controller') < roleMax){
            return [{
                role: 'upgrader',
                type: 'upgrade_room_controller',
                target: controller,
                priority: 0.1,
            }];
        }
    },
};

module.exports = job_upgrade_room_controller;

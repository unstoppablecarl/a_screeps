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

        var move = creep.moveTo(target);

        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return;
        }

        var action = creep.upgradeController(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            action === ERR_NOT_ENOUGH_ENERGY
        );

        if(!actionOK){
            job.end();
        }
    },


    getJobs: function(room) {
        var controller = room.controller;
        if(!controller){
            return [];
        }

        var roleMax = room.roleCountMax('upgrader');

        if(!_.isNumber(roleMax)){
            var adjacentTiles = controller.pos.adjacentEmptyTileCount();
            roleMax = room.roleCountMax('upgrader', adjacentTiles);
        }

        if(!roleMax){
            return [];
        }

        if(controller.targetOfJobTypeCount('upgrade_room_controller') < roleMax){
            return [{
                role: 'upgrader',
                type: 'upgrade_room_controller',
                target: controller,
                priority: 0.1,
            }];
        }
        return [];
    },
};

module.exports = job_upgrade_room_controller;

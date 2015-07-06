'use strict';

// move to a flag creep is assigned to standby
var job_move_to_flag = {
    name: 'move_to_flag',
    act: function(creep, job){
        var target = job.target();

        if(!target){

            job.end();
            return;
        }

        var result = creep.moveTo(target);
        var settings = job.settings();

        if(settings.prev_pos === undefined){
            settings.prev_pos = {
                x: null,
                y: null
            };
        }

        if(settings.no_path_count === undefined){
            settings.no_path_count = 0;
        }

        var atPrevPos = (
            creep.pos.x === settings.prev_pos.x &&
            creep.pos.y === settings.prev_pos.y
        );

        var atTargetPos = (
            creep.pos.x === target.pos.x &&
            creep.pos.y === target.pos.y
        );

        if(atPrevPos){
            settings.no_path_count++;
        } else {
            settings.no_path_count = 0;
        }

        if(
            atTargetPos ||
            (
                settings.no_path_count > 3 &&
                creep.pos.getRangeTo(target) < 5
            )
        ){
            creep.room.jobList().add({
                type: 'standby',
                role: creep.role(),
                source: creep,
                target: target
            }).start();
        }

        settings.prev_pos.x = creep.pos.x;
        settings.prev_pos.y = creep.pos.y;
    },
};

module.exports = job_move_to_flag;

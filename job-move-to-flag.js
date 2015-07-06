'use strict';

var job_move_to_flag = {
    name: 'move_to_flag',
    act: function(creep, job){
        var target = job.target();
        if(target){
            var result = creep.moveTo(target);



            var settings = job.settings();
            if(result === ERR_NO_PATH){
                if(settings.no_path_count === undefined){
                    settings.no_path_count = 0;
                }
                settings.no_path_count++;

            } else {
                settings.no_path_count = 0;
            }

            if(
                settings.no_path_count > 3 ||
                (creep.pos.x === target.pos.x && creep.pos.y === target.pos.y)
            ){
                creep.room.jobList().add({
                    type: 'standby',
                    role: creep.role(),
                    source: creep,
                    target: target
                }).start();
            }
        } else {
            job.end();
        }
    },
};

module.exports = job_move_to_flag;

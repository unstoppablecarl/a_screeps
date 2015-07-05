'use strict';

var job_move_to = {
    name: 'move_to',
    act: function(creep, job){
        var target = job.target();
        if(target){
            creep.moveTo(target);
            var settings = job.settings();
            var distance = settings.target_precision || 2;
            if(creep.pos.inRangeTo(target, distance)){
                job.end();
            }
        } else {
            job.end();
        }
    },
};

module.exports = job_move_to;

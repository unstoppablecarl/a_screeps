'use strict';

var job_idle = {
    name: 'idle',
    act: function(creep, job) {

        var target = job.target();


        if(!target){
            job.end();
            return;
        }

        var move = creep.moveTo(target);
        // @TODO check ERR_NO_PATH
        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return;
        }

    },
};

module.exports = job_idle;

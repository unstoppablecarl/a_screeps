'use strict';

var job_idle = {
    name: 'idle',
    act: function(creep, job) {

        var target = job.target();
        if(target){
            creep.moveTo(target);
        } else {
            job.end();
        }
    },
};

module.exports = job_idle;

'use strict';

var job_idle = {
    name: 'energy_collect',

    start: false,
    act: function(creep, job) {

        var target = job.target();

        if (!target) {
            job.end();
            return;
        }

        creep.moveTo(target);
    },
    cancel: false,
    end: false,
};

module.exports = job_idle;

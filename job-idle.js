'use strict';

var job_idle = {
    name: 'energy_collect',
    act: function(creep, job) {

        var target = job.target();

        if (!target) {
            job.end();
            return;
        }

        creep.moveTo(target);
    },
};

module.exports = job_idle;

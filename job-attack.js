'use strict';

var job_attack = {
    name: 'attack',
    start: false,
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
        }

        if(target){
            creep.moveTo(target);
            creep.attack(target);
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_attack;

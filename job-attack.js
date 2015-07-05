'use strict';

var job_attack = {
    name: 'attack',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
        }

        if(target){
            var result = creep.attack(target);
            if(result !== OK){
                if(result === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                } else {
                    job.end();
                }
            }
        }
    },
};

module.exports = job_attack;

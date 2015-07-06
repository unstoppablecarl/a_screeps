'use strict';

var job_attack = {
    name: 'attack',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        // if hurt by non-target while en-route to target fight back
        if(!creep.pos.isNearTo(target) && creep.hurtLastTick()){
            var adjacentHostiles = creep.adjacentHostiles();
            if(adjacentHostiles.length){
                target = _.min(adjacentHostiles, 'hits');
                creep.attack(target);
                return;
            }
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

'use strict';

var job_defend_rampart = {
    name: 'defend_rampart',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
        }

        var atTargetPos = (
            creep.pos.x === target.pos.x &&
            creep.pos.y === target.pos.y
        );

        if(!atTargetPos){
            creep.moveTo(target);
            return;
        }

        var adjacentHostiles = creep.adjacentHostiles();
        if(adjacentHostiles.length){
            target = _.min(adjacentHostiles, 'hits');
            creep.attack(target);
            return;
        }

        if(target){
            var result = creep.build(target);
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

module.exports = job_defend_rampart;

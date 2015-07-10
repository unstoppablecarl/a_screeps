'use strict';

var job_attack = {
    name: 'attack',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        // if hurt by non-target while en-route to target, fight back
        if(!creep.pos.isNearTo(target) && creep.hurtLastTick()){
            var adjacentHostiles = creep.adjacentHostiles();
            if(adjacentHostiles.length){
                target = _.min(adjacentHostiles, 'hits');
                creep.attack(target);
                return;
            }
        }


        if(target){

            var move = creep.moveTo(target);

            var moveOK = (
                move === OK ||
                move === ERR_TIRED ||
                move === ERR_NO_PATH
            );

            if(!moveOK){
                job.end();
                return;
            }

            var action = creep.attack(target);
            var actionOK = (
                action === OK ||
                action === ERR_NOT_IN_RANGE
            );

            if(!actionOK){
                job.end();
            }
        }
    },
};

module.exports = job_attack;

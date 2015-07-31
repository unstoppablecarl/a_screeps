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
        // if(!creep.pos.isNearTo(target) && creep.hurtLastTick()){
        //     var adjacentHostiles = creep.adjacentHostiles();
        //     if(adjacentHostiles.length){
        //         target = _.min(adjacentHostiles, 'hits');
        //         creep.attack(target);
        //         return;
        //     }
        // }


        if(target){

            var rangedDamage = creep.rangedAttackDamage();
            var meleeDamage = creep.attackDamage();
            var targetRange = creep.pos.getRangeTo(target);

            var attackIsMelee = meleeDamage > rangedDamage;

            if(
                attackIsMelee ||
                (
                    !attackIsMelee &&
                    targetRange > 3
                )
            ){
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
                return;
            }

            var action;

            if(
                attackIsMelee &&
                targetRange === 1
            ){
                action = creep.attack(target);
            }
            else if(
                rangedDamage &&
                targetRange <= 3
            ){
                action = creep.rangedAttack(target);
            }

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

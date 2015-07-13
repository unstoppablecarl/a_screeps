'use strict';

var job_defend_rampart = {
    name: 'defend_rampart',
    act: function(creep, job){
        var rampart = job.target();

        if(!rampart){
            job.end();
            return;
        }

        var atTargetPos = (
            creep.pos.x === rampart.pos.x &&
            creep.pos.y === rampart.pos.y
        );

        if(!atTargetPos){
            var move = creep.moveTo(rampart);

            var moveOK = (
                move === OK ||
                move === ERR_TIRED ||
                move === ERR_NO_PATH
            );
            if(!moveOK){
                job.end();
            }
            return;
        }

        if(!creep.room.containsHostiles()){
            return;
        }

        var rangedDamage = creep.rangedAttackDamage();
        var meleeDamage = creep.attackDamage();
        var attackIsMelee = meleeDamage > rangedDamage;

        var range = 1;

        if(rangedDamage){
            range = 3;
        }

        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);
        var target = _.min(targets, 'hits');

        if(!target){
            return;
        }

        var targetRange = creep.pos.getRangeTo(target);
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
    },
    getJobs: function(room){
        return room.flags()
            .filter(function(flag){
                return (
                    flag.role() === 'rampart' &&
                    !flag.isTargetOfJobType('defend_rampart')
                );
            })
            .map(function(flag){
                return {
                    role: 'rampart_defender',
                    type: 'defend_rampart',
                    target: flag,
                    priority: 0.7
                };
            });
    },
};

module.exports = job_defend_rampart;

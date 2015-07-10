'use strict';

var job_defend_rampart = {
    name: 'defend_rampart',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var atTargetPos = (
            creep.pos.x === target.pos.x &&
            creep.pos.y === target.pos.y
        );

        if(!atTargetPos){
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

        if(!creep.room.containsHostiles()){
            return;
        }

        var adjacentHostiles = creep.adjacentHostiles();
        if(adjacentHostiles.length){
            target = _.min(adjacentHostiles, 'hits');
            creep.attack(target);
            return;
        }

        // @TODO check if rampart is destroyed and move to adjacent ramparts
    },
    getJobs: function(room){
        return room.flags(function(flag){
            return (
                flag.role() === 'rampart_defender' &&
                !flag.isTargetOfJobType('defend_rampart')
            );
        }).map(function(flag){
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

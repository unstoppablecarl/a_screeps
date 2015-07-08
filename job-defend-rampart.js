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
            creep.moveTo(target);
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
                flag.role() === 'defend_rampart' &&
                !flag.isTargetOfJobType('defend_rampart')
            );
        }).map(function(flag){
            return {
                role: 'defend_rampart',
                type: 'defend_rampart',
                target: flag,
                priority: 0.7
            };
        });
    },
};

module.exports = job_defend_rampart;

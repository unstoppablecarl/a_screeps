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
    },
};

module.exports = job_defend_rampart;

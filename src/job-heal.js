'use strict';

var job_helpers = require('job-helpers');

var job_heal = {
    name: 'repair',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        if(target.hits === target.hitsMax){
            job.end();
            return;
        }

        if(creep.carry.energy === 0){
            if(job_helpers.findEnergy(creep, job)){
                return;
            }
        }

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

        var action = creep.heal(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            action === ERR_NOT_ENOUGH_ENERGY
        );

        if(!actionOK){
            job.end();
        }
    },

    getJobs: function(room){

        var getPriority = this.getPriority;

        return room.creeps()
            .filter(function(creep){
                return (
                    creep.hits < creep.hitsMax &&
                    !creep.isTargetOfJobType('heal')
                );
            })
            .map(function(creep){
                return {
                    role: 'healer',
                    type: 'heal',
                    target: creep,
                    priority: getPriority(room, creep)
                };
            });
    },

    getJobPriority: function(job){

        var target = job.target();
        if(!target){
            return 0;
        }

        return this.getPriority(job.room, target);
    },

    getPriority: function(room, target){

        var priority = 0.7;

        if(room.containsHostiles()){
            priority = 0.8;
        }

        var damagePercent = 1 - (target.hits / target.hitsMax);

        // move one decimal over
        priority += damagePercent * 0.1;

        return priority;
    },
};

module.exports = job_heal;

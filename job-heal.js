'use strict';

var job_energy_collect = require('job-energy-collect');

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

        if(
            creep.energy === 0 &&
            !creep.isTargetOfJobType('energy_deliver', true) &&
            !creep.room.idleCreeps('carrier').length
        ){
            job_energy_collect.startEnergyCollect(creep);
            return;
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

        return room.creeps()
            .filter(function(creep){
                return (
                    creep.hits < creep.hitsMax &&
                    !creep.isTargetOfJobType('heal')
                );
            })
            .map(function(creep){

                var priority = 0.7;

                if(room.containsHostiles()){
                    priority = 0.8;
                }

                var damage = 1 - (creep.hits / creep.hitsMax);

                // move one decimal over
                priority += damage * 0.1;

                return {
                    role: 'healer',
                    type: 'heal',
                    target: creep,
                    priority: priority
                };

            });
    },

    getJobPriority: function(job){
        return this.getPriority(job.room, job.target());
    },

    getPriority: function(room, target){

        var priority = 0.7;

        if(room.containsHostiles()){
            priority = 0.8;
        }

        var damage = 1 - (target.hits / target.hitsMax);

        // move one decimal over
        priority += damage * 0.1;

        return priority;
    },
};

module.exports = job_heal;

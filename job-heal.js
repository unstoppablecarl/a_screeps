'use strict';

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

        var creeps = room.creeps()
            .filter(function(creep){
                return creep.hits < creep.hitsMax;
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
    }
};

module.exports = job_heal;
